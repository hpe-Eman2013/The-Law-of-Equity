import mongoose, { Schema, Types } from "mongoose";

export interface IModule {
  title: string;
  slug: string;

  // Assessment settings
  questionCount: number; // default 10
  passPct: number;       // default 70
}

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    questionCount: { type: Number, default: 10 },
    passPct: { type: Number, default: 70 },
  },
  { timestamps: true }
);

export default mongoose.model<IModule>("Module", ModuleSchema);
