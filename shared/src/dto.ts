import type { Id, ISODateString, Timestamped } from "./types";

export type QuestionType = "mcq" | "tf";

export type QuestionDTO = Timestamped & {
  id: Id;
  moduleId: Id;
  type: QuestionType;
  text: string;
  choices: string[];
  correctIndex: number;
  points: number;
};

export type QuestionPublicDTO = Omit<QuestionDTO, "correctIndex">;

export type CreateQuestionInput = {
  moduleId: Id;
  type?: QuestionType;
  text: string;
  choices?: string[];
  correctIndex: number;
  points?: number;
};

export type UpdateQuestionInput = Partial<Omit<CreateQuestionInput, "moduleId">>;

export type AttemptAnswerDTO = {
  qid: Id;
  choiceIndex: number;
};

export type AttemptDTO = Timestamped & {
  id: Id;
  userId: Id;
  moduleId: Id;
  answers: AttemptAnswerDTO[];
  score: number;
  passed: boolean;
  startedAt: ISODateString;
  submittedAt?: ISODateString;
};
export type AttemptFeedbackDTO = {
  qid: Id;
  chosenIndex: number | null;
  correct: boolean;
  pointsEarned: number;
  pointsPossible: number;
};

export type StartAttemptResponseDTO = {
  attemptId: Id;
  attemptNo: number;
  passPct: number;
  questions: ServedQuestionDTO[];
};

export type SubmitAttemptResponseDTO = {
  attemptId: Id;
  attemptNo: number;
  score: number;
  maxScore: number;
  pct: number;
  passPct: number;
  passed: boolean;
  feedback: AttemptFeedbackDTO[];
  next: { canProceed: boolean };
};

export type StartAttemptInput = {
  moduleId: Id;
};

export type SubmitAttemptInput = {
  attemptId: Id;
  answers: AttemptAnswerDTO[];
};
export type ModuleDTO = Timestamped & {
  id: Id;
  slug: string;
  title: string;
  order: number;
  passPct: number;
  questionCount: number;
};
/**
 * Question shape that is SAFE to send to the client.
 * No correctIndex included.
 */
export type ServedQuestionDTO = {
  id: string;
  type: QuestionType;
  text: string;
  choices: string[];
  points: number;
};
export type ModuleListDTO = ModuleDTO[];

export type ModuleWithQuestionsDTO = {
  module: ModuleDTO;
  questions: ServedQuestionDTO[]; // reuse the ServedQuestionDTO from assessments start
};