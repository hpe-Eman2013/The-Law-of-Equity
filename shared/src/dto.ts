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

export type StartAttemptInput = {
  moduleId: Id;
};

export type SubmitAttemptInput = {
  attemptId: Id;
  answers: AttemptAnswerDTO[];
};
