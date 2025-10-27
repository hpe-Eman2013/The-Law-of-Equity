import { connectDB } from "./db.js";
import Module from "./models/Module.js";
import Question from "./models/Question.js";
import dotenv from "dotenv";
dotenv.config();
await connectDB(process.env.MONGODB_URI);
const mod = await Module.findOneAndUpdate({ slug: "01-foundations" }, { slug: "01-foundations", title: "Foundations of Equity", order: 1,
    readingLinks: [
        "course-structure/modules/01-foundations/index.html",
        "reference-library/Equity-Files-OCR/A-Collection-Of-Legal-Maxims-In-Law-And-Equity-1880_ocred.pdf"
    ] }, { upsert: true, new: true });
await Question.deleteMany({ moduleId: mod._id });
await Question.insertMany([
    { moduleId: mod._id, type: "tf", text: "Equity was created to contradict the common law.", choices: ["True", "False"], correctIndex: 1, points: 1 },
    { moduleId: mod._id, type: "mcq", text: "Which maxim underlies laches?", choices: [
            "Equity regards as done that which ought to be done",
            "He who comes into equity must come with clean hands",
            "Equity aids the vigilant, not those who slumber on their rights",
            "Equality is equity"
        ], correctIndex: 2, points: 1 }
]);
console.log("✅ Seeded Part 1");
process.exit(0);
