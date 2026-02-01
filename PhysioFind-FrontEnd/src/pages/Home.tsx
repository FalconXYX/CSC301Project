import "./Home.css";

import Section from "../components/Section";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Section id="hero">
        <div className="title">
          <h1 className="heading">
            Find the right physio. Not just the closest one.
          </h1>
          <p className="subheading">
            PhysioFind matches you with Ontario providers based on availability,
            insurance, location, and specialization &ndash; then lets you book
            instantly.
          </p>
        </div>
        <div className="cta-container">
          <Link to="/find-provider" className="cta-btn primary">
            Find a provider
          </Link>
          <Link to="#" className="cta-btn secondary">
            For clinics & practitioners
          </Link>
        </div>
      </Section>
    </>
  );
}

export default Home;
