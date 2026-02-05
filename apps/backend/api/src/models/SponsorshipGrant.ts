import mongoose, { Schema, Types } from "mongoose";

export interface SponsorshipGrantDoc {
  sponsorProfileId: Types.ObjectId;
  courseId: Types.ObjectId;

  seatsPurchased: number;
  seatsUsed: number;

  status: "active" | "closed" | "expired";
  expiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const SponsorshipGrantSchema = new Schema<SponsorshipGrantDoc>(
  {
    sponsorProfileId: { type: Schema.Types.ObjectId, ref: "SponsorProfile", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },

    seatsPurchased: { type: Number, required: true, min: 1 },
    seatsUsed: { type: Number, required: true, min: 0, default: 0 },

    status: { type: String, enum: ["active", "closed", "expired"], default: "active", index: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

SponsorshipGrantSchema.index({ sponsorProfileId: 1, courseId: 1, createdAt: -1 });

export default mongoose.model<SponsorshipGrantDoc>("SponsorshipGrant", SponsorshipGrantSchema);
