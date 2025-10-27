import { Router } from "express";
import jwt from "jsonwebtoken";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
const r = Router();
function requireAuth(req, res, next) {
    const auth = req.headers.authorization?.split(" ")[1];
    if (!auth)
        return res.status(401).json({ ok: false, error: "No token" });
    try {
        req.user = jwt.verify(auth, process.env.JWT_SECRET);
        next();
    }
    catch {
        return res.status(401).json({ ok: false, error: "Invalid token" });
    }
}
r.post("/:slug/submit", requireAuth, async (req, res) => {
    const mod = await Module.findOne({ slug: req.params.slug });
    if (!mod)
        return res.status(404).json({ ok: false, error: "Module not found" });
    const qs = await Question.find({ moduleId: mod._id });
    const answerMap = new Map((req.body.answers || []).map((a) => [String(a.qid), a.choiceIndex]));
    let score = 0;
    qs.forEach(q => {
        const pick = answerMap.get(String(q._id));
        if (pick === q.correctIndex)
            score += (q.points ?? 1);
    });
    const total = qs.reduce((s, q) => s + (q.points ?? 1), 0);
    const passed = score / Math.max(total, 1) >= 0.7;
    const attempt = await Attempt.create({
        userId: req.user.uid, moduleId: mod._id, answers: req.body.answers || [],
        score, passed, startedAt: req.body.startedAt ? new Date(req.body.startedAt) : new Date(),
        submittedAt: new Date()
    });
    res.json({ ok: true, score, total, passed, attemptId: attempt._id });
});
export default r;
