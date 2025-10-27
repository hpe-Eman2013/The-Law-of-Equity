import jwt from "jsonwebtoken";
export function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "12h" });
}
export function verifyToken<T=any>(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as T;
}
