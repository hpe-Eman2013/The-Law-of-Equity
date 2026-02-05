import mongoose, { Schema, Types } from "mongoose";
import type { EnrollmentStatus } from "../types/access";

export interface EnrollmentDoc {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;

  status: EnrollmentStatus; // active|revoked|expired
  enrolledAt: Date;
  expiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<EnrollmentDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },

    status: { type: String, enum: ["active", "revoked", "expired"], default: "active", index: true },
    enrolledAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate active-ish enrollments for same user/course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<EnrollmentDoc>("Enrollment", EnrollmentSchema);
