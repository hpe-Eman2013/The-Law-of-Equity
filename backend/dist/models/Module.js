import mongoose from "mongoose";
const ModuleSchema = new mongoose.Schema({
    slug: { type: String, unique: true, index: true },
    title: String,
    order: Number,
    isRequired: { type: Boolean, default: true },
    readingLinks: [String]
}, { timestamps: true });
export default mongoose.model("Module", ModuleSchema);
