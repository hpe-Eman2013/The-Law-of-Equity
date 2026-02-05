import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Not authenticated."));
  if (!req.user.isAdmin) return next(new HttpError(403, "Admin only."));
  next();
}
