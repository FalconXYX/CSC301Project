import type { Question, FormAnswer } from "./types";
import QuestionMultiSelect from "./QuestionMultiSelect";
import QuestionText from "./QuestionText";
import QuestionRadio from "./QuestionRadio";
import "./QuestionCard.css";

interface QuestionCardProps {
  question: Question;
  value: FormAnswer;
  onChange: (value: FormAnswer) => void;
  validationError?: string;
}

function QuestionCard({
  question,
  value,
  onChange,
  validationError,
}: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case "multiselect":
        return (
          <QuestionMultiSelect
            options={question.options || []}
            value={(value as string[]) || []}
            onChange={onChange}
            required={question.required}
            questionId={question.id}
          />
        );
      case "text":
        return (
          <QuestionText
            value={value as string}
            onChange={onChange}
            placeholder={question.placeholder}
            required={question.required}
            validation={question.validation}
            validationError={validationError}
            questionId={question.id}
          />
        );
      case "radio":
        return (
          <QuestionRadio
            options={question.options || []}
            value={value as string}
            onChange={onChange}
            required={question.required}
            questionId={question.id}
          />
        );
      default:
        return null;
    }
  };

  return (
    <fieldset className="question-card">
      <legend className="question-text">{question.question}</legend>
      {renderInput()}
    </fieldset>
  );
}

export default QuestionCard;
