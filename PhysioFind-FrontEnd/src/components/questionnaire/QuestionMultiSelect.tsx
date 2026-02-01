import type { QuestionOption } from "./types";
import "./QuestionInputs.css";

interface QuestionMultiSelectProps {
  options: QuestionOption[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  questionId: string;
}

function QuestionMultiSelect({
  options,
  value,
  onChange,
  required,
  questionId,
}: QuestionMultiSelectProps) {
  const handleCheckboxChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="question-input">
      <div
        className="multiselect-container"
        role="group"
        aria-invalid={required && value.length === 0 ? "true" : "false"}
      >
        {options.map((option) => (
          <label key={option.value} className="checkbox-label">
            <input
              type="checkbox"
              id={`${questionId}-${option.value}`}
              name={questionId}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="checkbox-input"
            />
            <span className="checkbox-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionMultiSelect;
