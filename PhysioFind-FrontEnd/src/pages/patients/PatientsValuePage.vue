<script setup lang="ts">
/*
 * Patients Value Proposition Page
 *
 * This view explains how PhysioFind helps patients get the right care. It
 * guides users through the high-level journey of taking the matching
 * questionnaire, reviewing their matches and booking an appointment. The
 * content emphasizes secure data handling and accurate matching based on
 * insurance, availability and specialty needs. A prominent call to
 * action links directly to the questionnaire so patients can get started
 * immediately.
 */
</script>

<template>
  <section id="patients-hero" class="full-with-lanes">
    <div class="hero-inner">
      <h1 class="heading">Get matched with the right care</h1>
      <p class="description">
        PhysioFind's secure questionnaire and matching algorithm connect you with providers who meet
        your insurance, availability and specialty needs.
      </p>
      <RouterLink to="/find-provider" class="cta primary"> Take the questionnaire </RouterLink>
    </div>
  </section>

  <section id="journey" class="full-with-lanes">
    <h2 class="journey-heading">Your journey</h2>
    <div class="steps">
      <div class="step">
        <div class="number">1</div>
        <h3>Take the questionnaire</h3>
        <p>
          Answer a few quick questions about your preferences, location and insurance to personalise
          your search.
        </p>
      </div>
      <div class="step">
        <div class="number">2</div>
        <h3>Get matched</h3>
        <p>
          We'll match you with vetted providers who fit your criteria - no endless searching
          required.
        </p>
      </div>
      <div class="step">
        <div class="number">3</div>
        <h3>Book an appointment</h3>
        <p>
          Choose your favourite provider and book online through our secure platform at a time that
          works for you.
        </p>
      </div>
    </div>
  </section>

  <section id="benefits" class="full-with-lanes">
    <h2 class="benefits-heading">Why choose PhysioFind</h2>
    <ul class="benefits-list">
      <li>Secure handling of your personal and medical information</li>
      <li>Accurate matching based on insurance, availability and specialty</li>
      <li>Access to verified providers across Ontario</li>
    </ul>
    <RouterLink to="/find-provider" class="cta secondary">Start your journey</RouterLink>
  </section>
</template>

<style scoped>
#patients-hero {
  padding: 5rem 1rem 3rem;
  background: linear-gradient(to bottom right, #e6f9fc, #f2f7fb);
  text-align: center;
  justify-content: center;
}

#patients-hero .hero-inner {
  max-width: 60rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 2.5rem 2rem;
}

#patients-hero .heading {
  font-family: var(--f-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a2441;
  margin: 0;
}

#patients-hero .description {
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 65ch;
  margin: 0;
  color: #0a2441;
}

.cta {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 999px;
  transition: opacity 75ms ease;
  text-decoration: none;
}

.cta.primary {
  background-color: #0078d4;
  color: #ffffff;
}

.cta.secondary {
  border: 2px solid #0078d4;
  color: #0078d4;
  margin-top: 1.5rem;
}

.cta:hover {
  opacity: 0.75;
}

#journey {
  background-color: #f5faff;
  padding: 4rem 1rem;
  text-align: center;
}

.journey-heading {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #0a2441;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  max-width: 60rem;
  margin: 0 auto;
}

.step {
  background-color: #ffffff;
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.step .number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background-color: #0078d4;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.step h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #0a2441;
}

.step p {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  color: #0a2441;
}

#benefits {
  padding: 4rem 1rem;
  background-color: #ffffff;
  text-align: center;
  justify-items: center;
}

.benefits-heading {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #0a2441;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0 auto 2rem;
  max-width: 40rem;
  text-align: left;
}

.benefits-list li {
  position: relative;
  padding-left: 1.75rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #0a2441;
}

.benefits-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  font-weight: 700;
  color: #0078d4;
}

@media (max-width: 900px) {
  .steps {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .step {
    width: min(100%, 22rem);
  }
}
</style>
