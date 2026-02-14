import type { FormData } from "../../components/patients/questionnaire/types";
import questionnaireData from "../../data/find-provider-questionnaire.json";

import "./FindProvider.css";

import Section from "../../components/Section";
import QuestionnaireContainer from "../../components/patients/questionnaire/QuestionnaireContainer";
import { useNavigate } from "react-router-dom";

function FindProvider() {
  const navigate = useNavigate();

  const handleSubmit = (data: FormData) => {
    // postal code question id in your questionnaire JSON is "location"
    console.log("Form submitted:", data);

    const raw = data.location;
    const postalCode = (typeof raw === "string" ? raw : "").trim().toUpperCase();

    // TODO: Handle form submission (e.g., send to API)
    navigate(`/find-provider/results?postalCode=${encodeURIComponent(postalCode)}`);
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
