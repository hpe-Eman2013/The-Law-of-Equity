import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", index: true },
  type: { type: String, enum: ["mcq","tf"], default: "mcq" },
  text: String,
  choices: [String],
  correctIndex: Number,
  points: { type: Number, default: 1 }
},{ timestamps:true });
export default mongoose.model("Question", QuestionSchema);
