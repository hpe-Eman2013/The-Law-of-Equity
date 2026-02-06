import jwt from "jsonwebtoken";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export function signToken(payload: object) {
  return jwt.sign(payload, getSecret(), { expiresIn: "12h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getSecret());
}
