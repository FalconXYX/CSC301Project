import type { FormData } from "../../components/patients/questionnaire/types";
import questionnaireData from "../../data/find-provider-questionnaire.json";

import "./FindProvider.css";

import Section from "../../components/Section";
import QuestionnaireContainer from "../../components/patients/questionnaire/QuestionnaireContainer";

function FindProvider() {
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Handle form submission (e.g., send to API)
    open("/find-provider/results");
  };

  return (
    <Section id="questionnaire">
      <QuestionnaireContainer
        questions={questionnaireData.questions}
        onSubmit={handleSubmit}
      />
    </Section>
  );
}

export default FindProvider;
