import "./FindProvider.css";

import Section from "../../components/Section";
import QuestionnaireContainer from "../../components/questionnaire/QuestionnaireContainer";
import type { FormData } from "../../components/questionnaire/types";
import questionnaireData from "../../data/find-provider-questionnaire.json";

function FindProvider() {
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Handle form submission (e.g., send to API, navigate to results page)
  };

  return (
    <>
      <Section id="questionnaire">
        <QuestionnaireContainer
          questions={questionnaireData.questions}
          onSubmit={handleSubmit}
        />
      </Section>
    </>
  );
}

export default FindProvider;
