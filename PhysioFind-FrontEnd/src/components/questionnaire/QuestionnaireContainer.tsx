import { useState } from "react";
import type { Question, FormData, FormAnswer } from "./types";

import QuestionCard from "./QuestionCard";
import ProgressIndicator from "./ProgressIndicator";
import NavigationButtons from "./NavigationButtons";

import "./QuestionnaireContainer.css";

interface QuestionnaireContainerProps {
  questions: Question[];
  onSubmit: (data: FormData) => void;
}

function QuestionnaireContainer({
  questions,
  onSubmit,
}: QuestionnaireContainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [validationError, setValidationError] = useState<string>("");

  const currentQuestion = questions[currentStep];

  const validateCurrentAnswer = (): boolean => {
    const answer = formData[currentQuestion.id];

    // Check if required field is filled
    if (currentQuestion.required) {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        setValidationError("This field is required");
        return false;
      }

      if (typeof answer === "string" && answer.trim() === "") {
        setValidationError("This field is required");
        return false;
      }
    }

    // Validate text input with pattern
    if (
      currentQuestion.type === "text" &&
      currentQuestion.validation &&
      answer
    ) {
      const pattern = new RegExp(currentQuestion.validation.pattern);
      if (!pattern.test(answer as string)) {
        setValidationError(currentQuestion.validation.message);
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleAnswerChange = (value: FormAnswer) => {
    setFormData((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentAnswer()) {
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationError("");
    }
  };

  const canGoNext = () => {
    const answer = formData[currentQuestion.id];
    if (!currentQuestion.required) return true;

    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== "";
  };

  return (
    <form className="questionnaire-container" onSubmit={handleSubmit}>
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={questions.length}
      />
      <div className="question-wrapper">
        <QuestionCard
          question={currentQuestion}
          value={
            formData[currentQuestion.id] ||
            (currentQuestion.type === "multiselect" ? [] : "")
          }
          onChange={handleAnswerChange}
          validationError={validationError}
        />
      </div>
      <NavigationButtons
        onPrevious={handlePrevious}
        canGoPrevious={currentStep > 0}
        canGoNext={canGoNext()}
        isLastQuestion={currentStep === questions.length - 1}
      />
    </form>
  );
}

export default QuestionnaireContainer;
