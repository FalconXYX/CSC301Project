import type { ValidationRule } from "./types";
import "./QuestionInputs.css";

interface QuestionTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule;
  validationError?: string;
  questionId: string;
}

function QuestionText({
  value,
  onChange,
  placeholder,
  required,
  validation,
  validationError,
  questionId,
}: QuestionTextProps) {
  const inputId = `input-${questionId}`;
  const errorId = `error-${questionId}`;

  return (
    <div className="question-input">
      <input
        type="text"
        id={inputId}
        name={questionId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`text-input ${validationError ? "error" : ""}`}
        pattern={validation?.pattern}
        aria-invalid={validationError ? "true" : "false"}
        aria-describedby={validationError ? errorId : undefined}
      />
      {validationError && (
        <div id={errorId} className="validation-error" role="alert">
          {validationError}
        </div>
      )}
    </div>
  );
}

export default QuestionText;
