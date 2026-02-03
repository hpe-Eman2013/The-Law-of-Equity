import type { Id } from "./types";

export type QuestionType = "mcq" | "tf";

/** What the client receives when starting an attempt */
export type ServedQuestionDTO = {
  id: Id;
  type: QuestionType;
  text: string;
  choices: string[];
  points: number;
};

export type StartAttemptResponseDTO = {
  attemptId: Id;
  attemptNo: number;
  passPct: number;
  questions: ServedQuestionDTO[];
};

/** Client submits these answers */
export type AttemptAnswerDTO = {
  qid: Id;
  choiceIndex: number;
};

/** Per-question feedback after grading (no correct answers leaked) */
export type AttemptFeedbackDTO = {
  qid: Id;
  chosenIndex: number | null;
  correct: boolean;
  pointsEarned: number;
  pointsPossible: number;
};

export type SubmitAttemptResponseDTO = {
  attemptId: Id;
  attemptNo: number;
  score: number;
  maxScore: number;
  pct: number;     // percent score, e.g. 80.5
  passPct: number; // threshold percent, e.g. 70
  passed: boolean;
  feedback: AttemptFeedbackDTO[];
  next: { canProceed: boolean };
};
