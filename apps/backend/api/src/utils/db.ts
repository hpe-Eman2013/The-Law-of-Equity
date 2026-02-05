import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(uri: string) {
  if (!uri) throw new Error("MONGODB_URI is missing.");
  if (isConnected) return mongoose;

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  isConnected = true;

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("[db] disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[db] error:", err);
  });

  return mongoose;
}

export default mongoose;
