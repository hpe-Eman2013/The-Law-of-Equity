import mongoose, { Schema, Types } from "mongoose";

export interface IAttemptAnswer {
  qid: string;          // store as string for simplicity in payloads
  choiceIndex: number;  // selected choice index
}

export interface IAttempt {
  userId: Types.ObjectId;
  moduleId: Types.ObjectId;

  attemptNo: number;

  // Question set served for this attempt (anti-tamper + review)
  variant: Types.ObjectId[];

  answers: IAttemptAnswer[];

  score: number;
  maxScore: number;
  pct: number;
  passed: boolean;

  startedAt: Date;
  submittedAt?: Date;

  locked: boolean;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", index: true, required: true },

    attemptNo: { type: Number, required: true },

    variant: { type: [Schema.Types.ObjectId], ref: "Question", default: [] },

    answers: {
      type: [{ qid: String, choiceIndex: Number }],
      default: [],
    },

    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    pct: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },

    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },

    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate attemptNo per user/module
AttemptSchema.index({ userId: 1, moduleId: 1, attemptNo: 1 }, { unique: true });

export default mongoose.model<IAttempt>("Attempt", AttemptSchema);
