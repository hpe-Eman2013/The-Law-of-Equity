import { Router } from "express";
import Module from "../models/Module.js";
import Question from "../models/Question.js";

import type {
  ApiResponse,
  ModuleDTO,
  ModuleWithQuestionsDTO,
  ServedQuestionDTO,
} from "@equity/shared";

const r = Router();

function err(message: string) {
  return { ok: false, error: { message } } as const;
}

function toISO(d: any): string {
  return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
}

function mapModule(m: any): ModuleDTO {
  return {
    id: String(m._id),
    slug: String(m.slug),
    title: String(m.title ?? m.slug),
    order: Number(m.order ?? 0),
    passPct: Number(m.passPct ?? 70),
    questionCount: Number(m.questionCount ?? 10),
    createdAt: toISO(m.createdAt),
    updatedAt: toISO(m.updatedAt),
  };
}

function mapServedQuestion(q: any): ServedQuestionDTO {
  return {
    id: String(q._id),
    type: q.type,
    text: q.text,
    choices:
      q.type === "tf" && (!q.choices || q.choices.length === 0)
        ? ["True", "False"]
        : q.choices,
    points: q.points ?? 1,
  };
}

/**
 * GET /api/modules
 * Returns modules in order as DTOs.
 */
r.get("/", async (_req, res) => {
  const mods = await Module.find().sort({ order: 1 }).lean();

  const data = mods.map(mapModule);
  const payload: ApiResponse<ModuleDTO[]> = { ok: true, data };
  return res.json(payload);
});

/**
 * GET /api/modules/:slug/questions
 * Returns module + safe questions (no correctIndex).
 */
r.get("/:slug/questions", async (req, res) => {
  const mod = await Module.findOne({ slug: req.params.slug }).lean();
  if (!mod) return res.status(404).json(err("Module not found"));

  // IMPORTANT: exclude correctIndex defensively
  const qs = await Question.find({ moduleId: mod._id, active: true })
    .select({ correctIndex: 0 })
    .lean();

  const data: ModuleWithQuestionsDTO = {
    module: mapModule(mod),
    questions: qs.map(mapServedQuestion),
  };

  const payload: ApiResponse<ModuleWithQuestionsDTO> = { ok: true, data };
  return res.json(payload);
});

export default r;
