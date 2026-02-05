import { Router } from "express";
import mongoose, { Types } from "mongoose";

import SponsorProfile from "../models/SponsorProfile";
import SponsorshipGrant from "../models/SponsorshipGrant";
import SponsoredEnrollment from "../models/SponsoredEnrollment";

import { requireAdmin } from "../middleware/requireAdmin";
import { HttpError } from "../utils/errors";
import toObjectId from "../utils/objectId.js";

const router = Router();

/**
 * POST /api/sponsorships/sponsors
 * Create a sponsor profile (organization or individual)
 */
router.post("/sponsors", requireAdmin, async (req, res, next) => {
  try {
    const { ownerUserId, name, type, contactEmail } = req.body ?? {};

    if (!name || !type || !contactEmail) {
      throw new HttpError(400, "name, type, and contactEmail are required.");
    }

    const doc = await SponsorProfile.create({
      ownerUserId: ownerUserId ? toObjectId(ownerUserId, "ownerUserId") : null,
      name,
      type,
      contactEmail,
    });

    res.status(201).json({ sponsorProfile: doc });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sponsorships/grants
 * Create a grant (seat bucket) for a course
 */
router.post("/grants", requireAdmin, async (req, res, next) => {
  try {
    const { sponsorProfileId, courseId, seatsPurchased, expiresAt } = req.body ?? {};

    if (!sponsorProfileId || !courseId || !seatsPurchased) {
      throw new HttpError(400, "sponsorProfileId, courseId, seatsPurchased are required.");
    }

    const grant = await SponsorshipGrant.create({
      sponsorProfileId: toObjectId(sponsorProfileId, "sponsorProfileId"),
      courseId: toObjectId(courseId, "courseId"),
      seatsPurchased: Number(seatsPurchased),
      seatsUsed: 0,
      status: "active",
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json({ grant });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sponsorships/grants/:grantId/assign
 * Assign a sponsored seat to a user (creates SponsoredEnrollment and increments seatsUsed)
 *
 * Strict seats (transaction-safe):
 * - fails if no seats remaining
 * - fails if user already has a SponsoredEnrollment for the course
 * - increments seatsUsed atomically
 */
router.post<{ grantId: string }>("/grants/:grantId/assign", requireAdmin, async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { grantId } = req.params;
    const { userId } = req.body ?? {};

    if (!userId) throw new HttpError(400, "userId is required.");

    const grantObjectId = toObjectId(grantId, "grantId");
    const userObjectId = toObjectId(userId, "userId");

    let createdEnrollment: any = null;
    let updatedGrant: any = null;

    await session.withTransaction(async () => {
      const grant = await SponsorshipGrant.findById(grantObjectId).session(session);
      if (!grant) throw new HttpError(404, "Grant not found.");

      if (grant.status !== "active") throw new HttpError(400, "Grant is not active.");
      if (grant.expiresAt && grant.expiresAt.getTime() < Date.now()) throw new HttpError(400, "Grant expired.");

      if (grant.seatsUsed >= grant.seatsPurchased) {
        throw new HttpError(400, "No seats available on this grant.");
      }

      // Prevent duplicate sponsored enrollment (one per user/course)
      const existing = await SponsoredEnrollment.findOne({
        userId: userObjectId,
        courseId: grant.courseId,
      }).session(session);

      if (existing) throw new HttpError(409, "User already has a sponsored enrollment for this course.");

      const docs = await SponsoredEnrollment.create(
        [
          {
            userId: userObjectId,
            courseId: grant.courseId,
            grantId: grant._id,
            status: "active",
            assignedAt: new Date(),
          },
        ],
        { session }
      );

      grant.seatsUsed += 1;
      await grant.save({ session });

      createdEnrollment = docs[0];
      updatedGrant = grant;
    });

    res.status(201).json({ sponsoredEnrollment: createdEnrollment, grant: updatedGrant });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
});

/**
 * POST /api/sponsorships/enrollments/:id/revoke
 * Revocation frees a seat (recommended policy)
 */
router.post<{ id: string }>("/enrollments/:id/revoke", requireAdmin, async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const enrollmentId = toObjectId(id, "id");

    let revokedEnrollment: any = null;
    let grantAfter: any = null;

    await session.withTransaction(async () => {
      const enr = await SponsoredEnrollment.findById(enrollmentId).session(session);
      if (!enr) throw new HttpError(404, "Sponsored enrollment not found.");

      if (enr.status !== "active") throw new HttpError(400, "Enrollment is not active.");

      enr.status = "revoked";
      enr.revokedAt = new Date();
      await enr.save({ session });

      const grant = await SponsorshipGrant.findById(enr.grantId).session(session);
      if (grant && grant.seatsUsed > 0) {
        grant.seatsUsed -= 1;
        await grant.save({ session });
      }

      revokedEnrollment = enr;
      grantAfter = grant;
    });

    res.json({ sponsoredEnrollment: revokedEnrollment, grant: grantAfter });
  } catch (err) {
    next(err);
  } finally {
    session.endSession();
  }
});

export default router;
