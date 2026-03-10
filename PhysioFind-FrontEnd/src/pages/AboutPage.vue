<script setup lang="ts">
/**
 * About Page
 *
 * This page outlines the mission, vision, and problem statement for PhysioFind.
 * It also provides a simple "Contact Us" section that uses a support email
 * defined via environment variables (VITE_SUPPORT_EMAIL) or falls back to a
 * sensible default. Feel free to adjust the copy to better reflect your
 * company's messaging.
 */

const mission =
  'Our mission at PhysioFind is to connect patients with the right healthcare providers and clinics across Ontario. We aim to make the process of finding, booking, and managing physiotherapy and related services intuitive and accessible to everyone.'
const vision =
  'We envision a healthcare ecosystem where patients are empowered to make informed decisions and providers can seamlessly reach those in need, bridging the gap between demand and expertise.'
const problem =
  'Finding the right provider can be challenging; navigating insurance coverage, specialties, availability, and location often leads to frustration. PhysioFind simplifies this journey by matching patients with providers who meet their unique needs.'

// Support email can be defined in a .env file as VITE_SUPPORT_EMAIL; fallback provided for development
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@physiofind.com'
</script>

<template>
  <div class="about-page">
    <div class="about-inner">
      <header class="hero">
        <h1>About PhysioFind</h1>
        <p class="intro">
          Learn about our mission, vision, and the problem we aim to solve in the
          healthcare space.
        </p>
      </header>

      <section class="section">
        <h2>Our Mission</h2>
        <p>{{ mission }}</p>
      </section>

      <section class="section">
        <h2>Our Vision</h2>
        <p>{{ vision }}</p>
      </section>

      <section class="section">
        <h2>The Problem We Solve</h2>
        <p>{{ problem }}</p>
      </section>

      <section class="section contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need support, please reach out to us at
          <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
/*
 * Updated styling for the About page to match the colour scheme of the
 * homepage and patients value page. The page uses a soft gradient
 * background with a semi-transparent card for the content, similar to the
 * hero sections elsewhere on the site. Typography and colours mirror
 * those used throughout the application.
 */

.about-page {
  /* Provide generous padding and a gradient background */
  padding: 5rem 1rem 3rem;
  background: linear-gradient(to bottom right, #e6f9fc, #f2f7fb);
  display: flex;
  justify-content: center;
}

.about-inner {
  max-width: 60rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 2.5rem 2rem;
}

/* Hero header styles */
.hero h1 {
  font-family: var(--f-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a2441;
  margin: 0;
}

.hero .intro {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #0a2441;
  max-width: 65ch;
  margin: 0 auto;
}

/* Section styles */
.section h2 {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  color: #0a2441;
  margin-bottom: 0.75rem;
}

.section p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #0a2441;
  max-width: 65ch;
  margin: 0;
}

/* Contact link styling */
.contact a {
  color: #0078d4;
  text-decoration: underline;
}

@media (max-width: 900px) {
  .about-inner {
    padding: 2rem 1.5rem;
  }

  .section h2 {
    font-size: 1.75rem;
  }
}
</style>