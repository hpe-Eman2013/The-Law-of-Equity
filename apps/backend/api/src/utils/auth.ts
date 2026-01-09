import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction){
  const auth = req.headers.authorization?.split(" ")[1];
  if(!auth) return res.status(401).json({ ok:false, error:"No token" });
  try { req.user = jwt.verify(auth, process.env.JWT_SECRET!); next(); }
  catch { return res.status(401).json({ ok:false, error:"Invalid token" }); }
}
