import { Router } from "express";
// jwt is provided/handled by the shared auth util; don't import it here to avoid shadowing
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { requireAuth } from "../utils/auth.js"; // replace local function

const r = Router();

// use the shared `requireAuth` imported from ../utils/auth.js to avoid
// duplicating logic and to prevent a local name collision with the import
r.post("/:slug/submit", requireAuth, async (req:any,res) => {
  const mod = await Module.findOne({ slug: req.params.slug });
  if (!mod) return res.status(404).json({ ok:false, error:"Module not found" });
  const qs = await Question.find({ moduleId: mod._id });
  const answerMap = new Map((req.body.answers||[]).map((a:any)=>[String(a.qid), a.choiceIndex]));

  let score = 0;
  qs.forEach(q => {
    const pick = answerMap.get(String(q._id));
    if (pick === q.correctIndex) score += (q.points ?? 1);
  });

  const total = qs.reduce((s,q)=>s+(q.points??1),0);
  const passed = score/Math.max(total,1) >= 0.7;
  const attempt = await Attempt.create({
    userId: (req.user as any).uid, moduleId: mod._id, answers: req.body.answers||[],
    score, passed, startedAt: req.body.startedAt ? new Date(req.body.startedAt) : new Date(),
    submittedAt: new Date()
  });

  res.json({ ok:true, score, total, passed, attemptId: attempt._id });
});

export default r;
