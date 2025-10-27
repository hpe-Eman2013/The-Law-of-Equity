import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Module from "./models/Module.js";
import Question from "./models/Question.js";

dotenv.config();

async function run() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("Usage: tsx src/import-questions.ts <path-to-quiz.json>");
    process.exit(1);
  }
  const full = path.resolve(fileArg);
  const raw = fs.readFileSync(full, "utf-8");
  const data = JSON.parse(raw);

  await connectDB(process.env.MONGODB_URI!);

  const mod = await Module.findOne({ slug: data.moduleSlug });
  if (!mod) {
    console.error(`Module not found: ${data.moduleSlug}`);
    process.exit(1);
  }

  // wipe and re-insert for this module
  await Question.deleteMany({ moduleId: mod._id });
  const docs = data.questions.map((q: any) => ({
    moduleId: mod._id,
    type: q.type,
    text: q.text,
    choices: q.choices,
    correctIndex: q.correctIndex,
    points: q.points ?? 1
  }));
  await Question.insertMany(docs);

  console.log(`✅ Imported ${docs.length} questions for ${data.moduleSlug}`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
