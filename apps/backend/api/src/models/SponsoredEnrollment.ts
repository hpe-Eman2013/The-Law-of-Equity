import mongoose, { Schema, Types } from "mongoose";
import type { EnrollmentStatus } from "../types/access";

export interface SponsoredEnrollmentDoc {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;

  grantId: Types.ObjectId;

  status: EnrollmentStatus; // active|revoked|expired
  assignedAt: Date;
  revokedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const SponsoredEnrollmentSchema = new Schema<SponsoredEnrollmentDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },

    grantId: { type: Schema.Types.ObjectId, ref: "SponsorshipGrant", required: true, index: true },

    status: { type: String, enum: ["active", "revoked", "expired"], default: "active", index: true },
    assignedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent multiple sponsored enrollments per user/course
SponsoredEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<SponsoredEnrollmentDoc>("SponsoredEnrollment", SponsoredEnrollmentSchema);
