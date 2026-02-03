import "./ProgressIndicator.css";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="progress-indicator" aria-live="polite" aria-atomic="true">
      <div className="progress-text" id="progress-label">
        Question {currentStep + 1} of {totalSteps}
      </div>
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-labelledby="progress-label"
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressIndicator;
