import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./utils/db.js";
import Module, { type IModule } from "./models/Module.js";

dotenv.config();

/**
 * Seed only STRUCTURAL data (Modules, defaults, etc.).
 * Do NOT seed question banks here — use src/utils/import-questions.ts instead.
 *
 * Run:
 *   npx tsx api/src/seed.ts
 */
async function seedModules() {
  const modules: Array<Partial<IModule> & { slug: string; title: string }> = [
    {
      slug: "equity-foundations",
      title: "Equity Foundations",
      // Assessment defaults
      questionCount: 10,
      passPct: 70,
    },

    // Keep/extend your existing module(s) here.
    // If your Module model supports these extra fields (order/readingLinks/etc.),
    // you can include them as well.
    {
      slug: "01-foundations",
      title: "Foundations of Equity",
      questionCount: 10,
      passPct: 70,
      // If your Module schema includes these fields, uncomment and populate:
      // order: 1,
      // readingLinks: [
      //   "/lectures/01-foundations/index.html",
      //   "https://github.com/.../A-Collection-Of-Legal-Maxims-In-Law-And-Equity-1880_ocred.pdf",
      // ],
    },
  ];

  for (const m of modules) {
    await Module.findOneAndUpdate(
      { slug: m.slug },
      {
        // Only set on insert to keep seed idempotent and avoid overwriting edits.
        $setOnInsert: m,
      },
      { upsert: true, new: true }
    );

    console.log(`✔ Module ensured: ${m.slug}`);
  }
}

async function run() {
  await connectDB(process.env.MONGODB_URI!);
  console.log("✅ MongoDB connected");

  await seedModules();

  await mongoose.disconnect();
  console.log("🌱 Seeding complete");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
