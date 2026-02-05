import mongoose, { Schema, Types } from "mongoose";
import type { SponsorType } from "../types/access";

export interface SponsorProfileDoc {
  ownerUserId?: Types.ObjectId | null; // if a student is the sponsor owner
  name: string;
  type: SponsorType;
  contactEmail: string;

  createdAt: Date;
  updatedAt: Date;
}

const SponsorProfileSchema = new Schema<SponsorProfileDoc>(
  {
    ownerUserId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["individual", "organization"], required: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

// Helpful: each user can have at most one sponsor profile in v1
SponsorProfileSchema.index(
  { ownerUserId: 1 },
  { unique: true, partialFilterExpression: { ownerUserId: { $type: "objectId" } } }
);

export default mongoose.model<SponsorProfileDoc>("SponsorProfile", SponsorProfileSchema);
