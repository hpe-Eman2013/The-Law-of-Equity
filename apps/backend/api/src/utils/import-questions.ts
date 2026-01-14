import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";
import Module from "../models/Module.js";
import Question from "../models/Question.js";

dotenv.config();

interface BankQuestion {
  type: "mcq" | "tf";
  text: string;
  choices: string[];
  correctIndex: number;
  points?: number;
  tags?: string[];
  difficulty?: number;
  explanation?: string;
}

interface QuestionBankFile {
  moduleSlug: string;
  questions: BankQuestion[];
}

async function run() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("Usage: tsx src/utils/import-questions.ts <bank.json>");
    process.exit(1);
  }

  const fullPath = path.resolve(fileArg);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const raw = fs.readFileSync(fullPath, "utf-8");
  const data = JSON.parse(raw) as QuestionBankFile;

  if (!data.moduleSlug || !Array.isArray(data.questions)) {
    throw new Error("Invalid bank file: must include moduleSlug and questions[]");
  }

  await connectDB(process.env.MONGODB_URI!);

  const mod = await Module.findOne({ slug: data.moduleSlug });
  if (!mod) {
    throw new Error(`Module not found for slug: ${data.moduleSlug}`);
  }

  console.log(`📘 Importing question bank for module: ${mod.slug}`);
  console.log(`🧮 Questions in file: ${data.questions.length}`);

  let upserted = 0;

  for (const q of data.questions) {
    if (!q.text || typeof q.correctIndex !== "number") {
      console.warn("⚠️ Skipping invalid question:", q.text);
      continue;
    }

    await Question.updateOne(
      {
        moduleId: mod._id,
        text: q.text.trim()
      },
      {
        $set: {
          moduleId: mod._id,
          type: q.type,
          text: q.text.trim(),
          choices: q.choices,
          correctIndex: q.correctIndex,
          points: q.points ?? 1,
          tags: q.tags ?? [],
          difficulty: q.difficulty,
          explanation: q.explanation,
          active: true
        }
      },
      { upsert: true }
    );

    upserted++;
  }

  console.log(`✅ Upserted ${upserted} questions for module "${mod.slug}"`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
