import mongoose, { Schema, Types } from "mongoose";

export type QuestionType = "mcq" | "tf";

export interface IQuestion {
  moduleId: Types.ObjectId;
  type: QuestionType;
  text: string;
  choices: string[];
  correctIndex: number;
  points: number;
  active: boolean;
  tags?: string[];
  difficulty?: number; // 1-5 optional
  explanation?: string;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", index: true, required: true },
    type: { type: String, enum: ["mcq", "tf"], default: "mcq", required: true },
    text: { type: String, required: true },
    choices: { type: [String], default: [] },
    correctIndex: { type: Number, required: true },
    points: { type: Number, default: 1 },
    active: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [] },
    difficulty: { type: Number },
    explanation: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>("Question", QuestionSchema);
