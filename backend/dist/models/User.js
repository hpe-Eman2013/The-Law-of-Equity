import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, index: true },
    name: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    passwordHash: { type: String, required: true }
}, { timestamps: true });
export default mongoose.model("User", UserSchema);
