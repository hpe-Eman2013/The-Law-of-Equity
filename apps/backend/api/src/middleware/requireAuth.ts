import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { HttpError } from "../utils/errors";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(new HttpError(401, "Not authenticated."));
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyToken(token) as { uid: string; role?: string };

    const user = await User.findById(payload.uid).lean();
    if (!user) return next(new HttpError(401, "Not authenticated."));

    // ✅ attach to req.user (what requireAdmin reads)
    (req as any).user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
    };

    return next();
  } catch {
    return next(new HttpError(401, "Not authenticated."));
  }
}
