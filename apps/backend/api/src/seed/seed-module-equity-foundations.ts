import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";
import Module from "../models/Module.js";

dotenv.config();

async function run() {
  await connectDB(process.env.MONGODB_URI!);
  console.log("✅ MongoDB connected");

  const slug = "equity-foundations";

  const doc = await Module.findOneAndUpdate(
    { slug },
    {
      $setOnInsert: {
        slug,
        title: "Equity Foundations",
        questionCount: 10,
        passPct: 70
      }
    },
    { upsert: true, new: true }
  );

  console.log("✅ Module ready:", { id: String(doc._id), slug: doc.slug, title: doc.title });
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
