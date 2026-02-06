import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("JWT_SECRET is not set");

export function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "12h" });
}
export function verifyToken<T = any>(token: string) {
  return jwt.verify(token, secret) as T;
}
