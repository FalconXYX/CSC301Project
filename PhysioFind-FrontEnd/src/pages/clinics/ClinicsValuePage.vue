<script setup lang="ts">
/*
 * Clinics Value Proposition Page
 *
 * This view explains how PhysioFind helps clinics and providers grow their practice.
 * It highlights increased visibility on the platform, streamlined online bookings
 * and an intuitive dashboard for managing clinic information and appointments.
 * A prominent call‑to‑action links directly to the clinic creation flow so providers
 * can start onboarding right away.
 */
</script>

<template>
  <!-- Hero section introducing the value proposition -->
  <section id="clinics-hero" class="full-with-lanes">
    <div class="hero-inner">
      <h1 class="heading">Reach more patients &amp; streamline bookings</h1>
      <p class="description">
        List your practice on PhysioFind to increase your clinic’s visibility,
        attract more patients and simplify booking through our secure platform.
      </p>
      <!-- CTA directing users to the clinic creation form -->
      <RouterLink to="/clinic/create" class="cta primary">List your clinic</RouterLink>
    </div>
  </section>

  <!-- Benefits section outlining why clinics should join -->
  <section id="benefits" class="full-with-lanes">
    <h2 class="benefits-heading">Why join PhysioFind</h2>
    <ul class="benefits-list">
      <li>Increase your clinic’s visibility to patients across Ontario</li>
      <li>Streamlined online booking for reduced administrative overhead</li>
      <li>Promote your services and specialties with a rich clinic profile</li>
    </ul>
  </section>

  <!-- Dashboard overview section explaining the clinic portal -->
  <section id="dashboard" class="full-with-lanes">
    <h2 class="dashboard-heading">Your clinic dashboard</h2>
    <div class="steps">
      <div class="step">
        <div class="number">1</div>
        <h3>Create your clinic</h3>
        <p>
          Register your clinic and provide your practice details. It only takes a few minutes.
        </p>
      </div>
      <div class="step">
        <div class="number">2</div>
        <h3>Manage your profile</h3>
        <p>
          Update your clinic information, booking link and offerings directly from your dashboard.
        </p>
      </div>
      <div class="step">
        <div class="number">3</div>
        <h3>Receive &amp; track bookings</h3>
        <p>
          Patients can book appointments online and you can view upcoming bookings in one place.
        </p>
      </div>
    </div>
    <!-- Secondary CTA linking to the dashboard for existing clinics -->
    <RouterLink to="/clinic/dashboard" class="cta secondary">View dashboard</RouterLink>
  </section>
</template>

<style scoped>
/* Hero section styling */
#clinics-hero {
  padding: 5rem 1rem 3rem;
  background: linear-gradient(to bottom right, #f0f4ff, #f6faff);
  text-align: center;
  justify-content: center;
}

#clinics-hero .hero-inner {
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

#clinics-hero .heading {
  font-family: var(--f-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a2441;
  margin: 0;
}

#clinics-hero .description {
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

#benefits,
#dashboard {
  padding: 4rem 1rem;
  text-align: center;
}

.benefits-heading,
.dashboard-heading {
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

/* Dashboard section styling */
#dashboard .steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  max-width: 60rem;
  margin: 0 auto;
}

#dashboard .step {
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

#dashboard .step .number {
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

#dashboard .step h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #0a2441;
}

#dashboard .step p {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  color: #0a2441;
}

@media (max-width: 900px) {
  #dashboard .steps {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  #dashboard .step {
    width: min(100%, 22rem);
  }
}
</style>