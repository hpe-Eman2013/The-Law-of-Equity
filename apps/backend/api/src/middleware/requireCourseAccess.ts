import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Enrollment from "../models/Enrollment";
import SponsoredEnrollment from "../models/SponsoredEnrollment";
import { HttpError } from "../utils/errors";

function isExpired(expiresAt?: Date | null) {
  if (!expiresAt) return false;
  return expiresAt.getTime() < Date.now();
}

/**
 * v1: pass a function that returns courseId, so you can use params/body/etc.
 */
export function requireCourseAccess(getCourseId: (req: Request) => string) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");

      const courseIdStr = getCourseId(req);
      if (!courseIdStr) throw new HttpError(400, "courseId is required.");

      const courseId = new Types.ObjectId(courseIdStr);
      const userId = req.user._id;

      // 1) Direct enrollment
      const direct = await Enrollment.findOne({ userId, courseId }).lean();
      if (direct) {
        if (direct.status !== "active") throw new HttpError(403, "Enrollment is not active.");
        if (isExpired(direct.expiresAt ?? null)) throw new HttpError(403, "Enrollment expired.");
        return next();
      }

      // 2) Sponsored enrollment
      const sponsored = await SponsoredEnrollment.findOne({ userId, courseId }).lean();
      if (sponsored) {
        if (sponsored.status !== "active") throw new HttpError(403, "Sponsored enrollment is not active.");
        // If you want expiry to exist only at grant-level, keep it there.
        // For v1 we keep it simple and do NOT check grant expiry here unless you want it.
        return next();
      }

      throw new HttpError(403, "No course access.");
    } catch (err) {
      next(err);
    }
  };
}
