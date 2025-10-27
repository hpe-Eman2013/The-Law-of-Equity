import { Router } from "express";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
const r = Router();
r.get("/", async (_req, res) => {
    const mods = await Module.find().sort({ order: 1 });
    res.json(mods);
});
r.get("/:slug/questions", async (req, res) => {
    const mod = await Module.findOne({ slug: req.params.slug });
    if (!mod)
        return res.status(404).json({ ok: false, error: "Module not found" });
    const qs = await Question.find({ moduleId: mod._id });
    res.json({ module: mod, questions: qs.map(q => ({
            id: q._id, type: q.type, text: q.text, choices: q.choices
        })) });
});
export default r;
