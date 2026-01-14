import { Router } from "express";
import mongoose from "mongoose";
import Module from "../models/Module.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { requireAuth } from "../utils/requireAuth.js";

const r = Router();

/**
 * POST /api/modules/:slug/attempts/start
 * Creates a new attempt record and returns a randomized set of questions (no correctIndex).
 */
r.post("/:slug/attempts/start", requireAuth, async (req: any, res) => {
  const mod = await Module.findOne({ slug: req.params.slug });
  if (!mod) return res.status(404).json({ ok: false, error: "Module not found" });

  const userId = req.user._id;
  if (!userId) return res.status(401).json({ ok: false, error: "No user in request" });

  // Determine attemptNo = last + 1
  const last = await Attempt.findOne({ userId, moduleId: mod._id }).sort({ attemptNo: -1 }).lean();
  const attemptNo = (last?.attemptNo ?? 0) + 1;

  const questionCount = mod.questionCount ?? 10;

  // Pull active questions; you can add tag/difficulty filtering later
  const bankSize = await Question.countDocuments({ moduleId: mod._id, active: true });
  if (bankSize < questionCount) {
    return res.status(400).json({
      ok: false,
      error: `Question bank too small. Need ${questionCount}, found ${bankSize}.`,
    });
  }

  // Random sample
  const sampled = await Question.aggregate([
    { $match: { moduleId: new mongoose.Types.ObjectId(String(mod._id)), active: true } },
    { $sample: { size: questionCount } },
    { $project: { correctIndex: 0 } }, // never send correct answers
  ]);

  const variantIds = sampled.map((q: any) => new mongoose.Types.ObjectId(String(q._id)));

  const attempt = await Attempt.create({
    userId,
    moduleId: mod._id,
    attemptNo,
    variant: variantIds,
    startedAt: new Date(),
  });

  return res.json({
    ok: true,
    attemptId: attempt._id,
    attemptNo,
    passPct: mod.passPct ?? 70,
    questions: sampled.map((q: any) => ({
      _id: q._id,
      type: q.type,
      text: q.text,
      choices:
        q.type === "tf" && (!q.choices || q.choices.length === 0) ? ["True", "False"] : q.choices,
      points: q.points ?? 1,
    })),
  });
});

/**
 * POST /api/modules/:slug/attempts/:attemptId/submit
 * Scores on server using the attempt.variant to validate what was served.
 */
r.post("/:slug/attempts/:attemptId/submit", requireAuth, async (req: any, res) => {
  const mod = await Module.findOne({ slug: req.params.slug });
  if (!mod) return res.status(404).json({ ok: false, error: "Module not found" });

  const userId = req.user._id;
  const { attemptId } = req.params;

  const attempt = await Attempt.findOne({ _id: attemptId, userId, moduleId: mod._id });
  if (!attempt) return res.status(404).json({ ok: false, error: "Attempt not found" });
  if (attempt.locked)
    return res.status(400).json({ ok: false, error: "Attempt already submitted" });

  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  // answers: [{ qid, choiceIndex }]

  // Only score questions that were served (variant)
  const servedIds = attempt.variant.map((id) => String(id));
  const servedSet = new Set(servedIds);

  const answerMap = new Map<string, number>();
  for (const a of answers) {
    if (!a?.qid) continue;
    if (!servedSet.has(String(a.qid))) continue; // reject answers for unserved questions
    if (typeof a.choiceIndex !== "number") continue;
    answerMap.set(String(a.qid), a.choiceIndex);
  }

  const qs = await Question.find({ _id: { $in: attempt.variant } }).lean();

  let score = 0;
  let maxScore = 0;

  const feedback = qs.map((q) => {
    const points = q.points ?? 1;
    maxScore += points;

    const chosen = answerMap.has(String(q._id)) ? answerMap.get(String(q._id))! : null;
    const correct = chosen !== null && chosen === q.correctIndex;
    if (correct) score += points;

    return {
      qid: String(q._id),
      chosenIndex: chosen,
      correct: correct,
      pointsEarned: correct ? points : 0,
      pointsPossible: points,
    };
  });

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0; // 2 decimals
  const passPct = mod.passPct ?? 70;
  const passed = pct >= passPct;

  attempt.answers = Array.from(answerMap.entries()).map(([qid, choiceIndex]) => ({
    qid,
    choiceIndex,
  }));
  attempt.score = score;
  attempt.maxScore = maxScore;
  attempt.pct = pct;
  attempt.passed = passed;
  attempt.submittedAt = new Date();
  attempt.locked = true;

  await attempt.save();

  return res.json({
    ok: true,
    attemptId: String(attempt._id),
    attemptNo: attempt.attemptNo,
    score,
    maxScore,
    pct,
    passPct,
    passed,
    feedback, // safe: does not include correct answers
    next: {
      canProceed: passed, // you can enforce this at the module navigation layer
    },
  });
});

export default r;
