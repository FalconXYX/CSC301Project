import "./NavigationButtons.css";

interface NavigationButtonsProps {
  onPrevious: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
}

function NavigationButtons({
  onPrevious,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
}: NavigationButtonsProps) {
  return (
    <div className="navigation-buttons">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="nav-btn previous"
      >
        Previous
      </button>
      <button type="submit" disabled={!canGoNext} className="nav-btn next">
        {isLastQuestion ? "Submit" : "Next"}
      </button>
    </div>
  );
}

export default NavigationButtons;
