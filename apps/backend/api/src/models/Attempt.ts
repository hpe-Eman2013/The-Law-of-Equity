import mongoose from "mongoose";
const AttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", index: true },
  answers: [{ qid: String, choiceIndex: Number }],
  score: Number,
  passed: Boolean,
  startedAt: Date,
  submittedAt: Date
},{ timestamps:true });
export default mongoose.model("Attempt", AttemptSchema);
