import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { HttpError } from "../utils/errors";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(new HttpError(401, "Not authenticated."));
    }

    const token = header.slice("Bearer ".length).trim();
    const payload = verifyToken(token) as { uid: string; role?: string };

    const user = await User.findById(payload.uid).lean();
    if (!user) return next(new HttpError(401, "Not authenticated."));

    // Attach what requireAdmin expects
    (req as any).user = {
      _id: user._id,
      email: user.email,
      isAdmin: user.role === "admin",
      role: user.role,
    };

    next();
  } catch (err) {
    next(new HttpError(401, "Not authenticated."));
  }
}
