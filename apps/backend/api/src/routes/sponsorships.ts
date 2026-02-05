import { Router } from "express";
import { Types } from "mongoose";
import SponsorProfile from "../models/SponsorProfile";
import SponsorshipGrant from "../models/SponsorshipGrant";
import SponsoredEnrollment from "../models/SponsoredEnrollment";
import { requireAdmin } from "../middleware/requireAdmin";
import { HttpError } from "../utils/errors";

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
      ownerUserId: ownerUserId ? new Types.ObjectId(ownerUserId) : null,
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
      sponsorProfileId: new Types.ObjectId(sponsorProfileId),
      courseId: new Types.ObjectId(courseId),
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
 */
router.post("/grants/:grantId/assign", requireAdmin, async (req, res, next) => {
  try {
    const { grantId } = req.params;
    const { userId } = req.body ?? {};

    if (!userId) throw new HttpError(400, "userId is required.");

    const grant = await SponsorshipGrant.findById(grantId);
    if (!grant) throw new HttpError(404, "Grant not found.");

    if (grant.status !== "active") throw new HttpError(400, "Grant is not active.");
    if (grant.expiresAt && grant.expiresAt.getTime() < Date.now()) throw new HttpError(400, "Grant expired.");

    if (grant.seatsUsed >= grant.seatsPurchased) {
      throw new HttpError(400, "No seats available on this grant.");
    }

    // Prevent duplicate enrollment
    const existing = await SponsoredEnrollment.findOne({
      userId: new Types.ObjectId(userId),
      courseId: grant.courseId,
    });

    if (existing) throw new HttpError(409, "User already has a sponsored enrollment for this course.");

    // Transaction-like behavior (simple v1 approach)
    const enrollment = await SponsoredEnrollment.create({
      userId: new Types.ObjectId(userId),
      courseId: grant.courseId,
      grantId: grant._id,
      status: "active",
      assignedAt: new Date(),
    });

    grant.seatsUsed += 1;
    await grant.save();

    res.status(201).json({ sponsoredEnrollment: enrollment, grant });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sponsorships/enrollments/:id/revoke
 */
router.post("/enrollments/:id/revoke", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const enr = await SponsoredEnrollment.findById(id);
    if (!enr) throw new HttpError(404, "Sponsored enrollment not found.");

    if (enr.status !== "active") throw new HttpError(400, "Enrollment is not active.");

    enr.status = "revoked";
    enr.revokedAt = new Date();
    await enr.save();

    // Optional: decrement seatsUsed (policy choice)
    // v1 recommendation: DO decrement seatsUsed so seat can be reassigned.
    const grant = await SponsorshipGrant.findById(enr.grantId);
    if (grant && grant.seatsUsed > 0) {
      grant.seatsUsed -= 1;
      await grant.save();
    }

    res.json({ sponsoredEnrollment: enr, grant });
  } catch (err) {
    next(err);
  }
});

export default router;
