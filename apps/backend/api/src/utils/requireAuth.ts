import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) return res.status(401).json({ ok: false, error: "No token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // ✅ Your tokens use `uid`
    const uid = payload.uid;
    if (!uid) return res.status(401).json({ ok: false, error: "Token missing uid" });

    (req as any).user = { _id: uid, role: payload.role };

    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}
