import type { FormData } from "../../components/patients/questionnaire/types";
import questionnaireData from "../../data/find-provider-questionnaire.json";

import "./FindProvider.css";

import Section from "../../components/Section";
import QuestionnaireContainer from "../../components/patients/questionnaire/QuestionnaireContainer";
import { useNavigate } from "react-router-dom";

function FindProvider() {
  const navigate = useNavigate();

// Inside FindProvider.tsx:

const handleSubmit = (data: FormData) => {
  // Extract and normalize the postal code
  const rawLocation = data.location;
  const postalCode = (typeof rawLocation === "string" ? rawLocation : "")
    .trim()
    .toUpperCase();

  // Extract the selected specialty
  const rawSpecialty = data.specialty;
  let specialty = "";
  if (Array.isArray(rawSpecialty)) {
    specialty = rawSpecialty[0] ?? "";
  } else if (typeof rawSpecialty === "string") {
    specialty = rawSpecialty;
  }

  // Build query params and navigate
  const params = new URLSearchParams();
  if (postalCode) params.set("postalCode", postalCode);
  if (specialty) params.set("specialty", specialty);
  navigate(`/find-provider/results?${params.toString()}`);
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