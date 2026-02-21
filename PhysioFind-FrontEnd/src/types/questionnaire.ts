/**
 * Base properties shared by all question types.
 * @internal
 */
interface QuestionBase {
  /** Unique identifier for the question */
  id: string
  /** Prompt text displayed to the user */
  prompt: string
  /** Whether the question must be answered before proceeding */
  required: boolean
}

/**
 * Represents a single selectable option in multi-select or radio questions.
 */
export interface QuestionOption {
  /** Display text shown to the user */
  label: string
  /** Internal value used when the option is selected */
  value: string
}

/**
 * Validation rules for text input questions.
 */
export interface QuestionValidation {
  /** Regular expression pattern the input must match */
  pattern: string
  /** Error message displayed when validation fails */
  message: string
}

/**
 * Question allowing multiple selections from a list of options.
 * User can select zero or more choices (checkboxes).
 */
export interface MultiSelectQuestion extends QuestionBase {
  type: 'multi-select'
  /** Available choices for the user to select from */
  options: QuestionOption[]
}

/**
 * Question allowing a single selection from a list of options.
 * User must select exactly one choice (radio buttons).
 */
export interface RadioQuestion extends QuestionBase {
  type: 'radio'
  /** Available choices for the user to select from */
  options: QuestionOption[]
}

/**
 * Question accepting free-form text input.
 * Optionally includes placeholder text and validation rules.
 */
export interface TextQuestion extends QuestionBase {
  type: 'text'
  /** Placeholder text shown when the input is empty */
  placeholder?: string
  /** Optional validation rules for the text input */
  validation?: QuestionValidation
}

/**
 * Union type representing any supported question type.
 * Used for type-safe handling of questions in the form system.
 */
export type Question = MultiSelectQuestion | RadioQuestion | TextQuestion

/**
 * Represents the user's answers to a questionnaire.
 * Keys are question IDs, and values are either a single string (for radio/text questions)
 * or an array of strings (for multi-select questions).
 */
export type QuestionnaireAnswers = Record<string, string | string[]>
