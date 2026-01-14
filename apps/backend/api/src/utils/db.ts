import mongoose from "mongoose";

export async function connectDB(uri: string) {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
}
