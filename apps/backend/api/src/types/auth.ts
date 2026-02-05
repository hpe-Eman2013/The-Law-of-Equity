import type { Types } from "mongoose";

export interface AuthUser {
  _id: Types.ObjectId;
  email: string;
  isAdmin?: boolean; // v1: simple
}

// If you already have Express Request augmentation elsewhere, use that.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
