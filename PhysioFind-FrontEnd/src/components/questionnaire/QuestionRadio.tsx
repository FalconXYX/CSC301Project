import type { QuestionOption } from "./types";
import "./QuestionInputs.css";

interface QuestionRadioProps {
  options: QuestionOption[];
  value: string;
  onChange: (value: string) => void;
  required: boolean;
  questionId: string;
}

function QuestionRadio({
  options,
  value,
  onChange,
  required,
  questionId,
}: QuestionRadioProps) {
  return (
    <div className="question-input">
      <div
        className="radio-container"
        role="radiogroup"
        aria-invalid={required && !value ? "true" : "false"}
      >
        {options.map((option) => (
          <label key={option.value} className="radio-label">
            <input
              type="radio"
              id={`${questionId}-${option.value}`}
              name={questionId}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className="radio-input"
            />
            <span className="radio-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionRadio;
