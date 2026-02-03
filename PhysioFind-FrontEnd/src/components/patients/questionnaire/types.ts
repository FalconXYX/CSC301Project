export interface QuestionOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  pattern: string;
  message: string;
}

export type QuestionType = "select" | "multiselect" | "text" | "radio";

export interface Question {
  id: string;
  type: QuestionType | string;
  question: string;
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  validation?: ValidationRule;
}

export interface QuestionnaireData {
  questions: Question[];
}

export type FormAnswer = string | string[];

export interface FormData {
  [questionId: string]: FormAnswer;
}
