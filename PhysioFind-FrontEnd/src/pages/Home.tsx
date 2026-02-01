import "./Home.css";

import Section from "../components/Section";

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
          <a href="#" className="cta-btn primary">
            Find a provider
          </a>
          <a href="#" className="cta-btn secondary">
            For clinics & practitioners
          </a>
        </div>
      </Section>
    </>
  );
}

export default Home;
