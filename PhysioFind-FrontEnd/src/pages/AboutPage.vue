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
          Learn about our mission, vision, and the problem we aim to solve in the healthcare space.
        </p>
      </header>

      <!-- Use a grid of information cards with icons to make the layout more engaging -->
      <div class="info-grid">
        <div class="info-card">
          <!-- Rocket emoji conveys forward momentum and progress for the mission -->
          <div class="icon-wrapper">🚀</div>
          <h2>Our Mission</h2>
          <p>{{ mission }}</p>
        </div>
        <div class="info-card">
          <!-- Telescope emoji symbolises far‑reaching vision -->
          <div class="icon-wrapper">🔭</div>
          <h2>Our Vision</h2>
          <p>{{ vision }}</p>
        </div>
        <div class="info-card">
          <!-- Puzzle piece illustrates solving complex problems -->
          <div class="icon-wrapper">🧩</div>
          <h2>The Problem We Solve</h2>
          <p>{{ problem }}</p>
        </div>
      </div>

      <section class="section contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or need support, please reach out to us at
          <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a
          >.
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
  padding: 5rem 1rem 3rem;

  background: linear-gradient(to bottom right, #e6f9fc, #f2f7fb);

  border-radius: 2rem;
  box-shadow: 0 0 30px 15px #e6f9fc;

  display: flex;
  justify-content: center;
}

.about-inner {
  max-width: 60rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: rgba(255, 255, 255, 0.95);

  border: none;
  border-top: 4px solid #0078d4;

  box-shadow: 0 30px 80px rgba(10, 36, 65, 0.15);

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
  width: 100%;
  text-align: center;
}

.hero .intro {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #0a2441;
  max-width: 65ch;
  margin: 0 auto;
  width: 100%;
  text-align: center;
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

/*
 * Info card grid for the mission, vision, and problem statements
 *
 * Rather than stacking plain text sections on top of each other, the
 * redesigned page presents the core pillars of PhysioFind in a flexible
 * grid of cards. Each card contains an emoji icon that helps convey
 * the concept visually (e.g. a rocket for the mission), a heading, and
 * supporting copy. The cards use the same colour palette as the rest
 * of the site but with a subtle elevation and centred text to make
 * them stand out. On smaller screens, the cards gracefully wrap into
 * full‑width rows to maintain readability.
 */
.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.info-card {
  flex: 1 1 30%;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.icon-wrapper {
  font-size: 2.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.info-card h2 {
  font-family: var(--f-serif);
  font-size: 1.75rem;
  font-weight: 600;
  color: #0a2441;
  margin: 0.25rem 0 0.5rem;
}

.info-card p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #0a2441;
  margin: 0;
  max-width: 65ch;
}

@media (max-width: 900px) {
  .info-card {
    flex: 1 1 100%;
  }
}
</style>
