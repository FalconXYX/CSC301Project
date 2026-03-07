<script setup lang="ts">
/*
 * Landing Page
 *
 * This page serves as the initial touchpoint for prospective users. It contains
 * a redesigned hero section with a clear value proposition and strong call‑to‑action
 * buttons, followed by a testimonials section. Testimonials are hardcoded and
 * generated with placeholder content – in a real application these could be
 * replaced with dynamic content fetched from a CMS or API.
 */

// Hardcoded testimonial data. Each testimonial includes a quote, the author’s
// name and their role (e.g., patient or clinic manager). Feel free to extend
// this array with additional entries or replace it with data from your backend.
const testimonials = [
  {
    quote:
      'As a busy clinic manager, PhysioFind has streamlined our booking process and connected us with more patients than ever.',
    author: 'Laura M.',
    role: 'Clinic Manager',
  },
  {
    quote:
      'I finally found a physio who understands my injury and my insurance coverage—it was so easy!',
    author: 'James K.',
    role: 'Patient',
  },
  {
    quote:
      'The matching questionnaire saved me from hours of research. Highly recommend!',
    author: 'Sofia L.',
    role: 'Patient',
  },
]

// Images for the landing page.  These are imported so that Vite can
// properly bundle them into the final build.  The hero photo shows
// a friendly doctor greeting a patient, while the specialty images
// illustrate each of the top‑searched healthcare fields on PhysioFind.
import heroImg from '../assets/hero.jpg'
import physiotherapistImg from '../assets/physiotherapist.jpg'
import psychologistImg from '../assets/psychologist.jpg'
import chiropractorImg from '../assets/chiropractor.jpg'

// Top searched specialties.  Each entry has a label and a photo.  In a
// production system you might fetch these from your backend or CMS to
// reflect real search trends.
const specialties = [
  { label: 'Physiotherapist', image: physiotherapistImg },
  { label: 'Psychologist', image: psychologistImg },
  { label: 'Chiropractor', image: chiropractorImg },
  // Removed Dermatologist entry because the platform does not support this specialty
]

// Top‑rated providers.  These are placeholder values meant to convey
// how high‑quality providers might be showcased on the landing page.  For
// simplicity we represent ratings as numbers; in the template we
// generate star symbols accordingly.  Replace this with real
// provider data when available.
const topProviders = [
  { name: 'Dr. Sarah Johnson', specialty: 'Physiotherapist', rating: 5 },
  { name: 'Dr. Miguel Pérez', specialty: 'Psychologist', rating: 5 },
  { name: 'Dr. Emily Chen', specialty: 'Chiropractor', rating: 4.5 },
  // Removed dermatologist because the platform does not list dermatologists
]
</script>

<template>
  <!-- Hero section with value proposition, supporting copy and an illustrative image -->
  <section id="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <h1 class="heading">Find the right provider.<br />Not just the closest one.</h1>
        <!-- Multiple paragraphs explain the value PhysioFind provides.  Keep
             the copy concise and scannable so visitors quickly grasp the
             benefits of the platform. -->
        <p class="description">
          PhysioFind connects patients and clinics across Ontario, taking into
          account your insurance, availability and specialty needs.  Our matching
          questionnaire helps identify the best practitioner for your unique
          situation.
        </p>
        <p class="description">
          Whether you’re recovering from an injury, seeking mental health
          support or looking for expert skin care, we’ve got you covered.  Book
          instantly and securely through our platform.
        </p>
        <div class="cta">
          <RouterLink to="/find-provider" class="primary">Find a provider</RouterLink>
          <RouterLink to="#specialties" class="secondary">Browse specialties</RouterLink>
        </div>
      </div>
      <div class="hero-image">
        <img :src="heroImg" alt="Doctor greeting a patient" />
      </div>
    </div>
  </section>

  <!-- Testimonials section -->
  <section id="testimonials">
    <div class="content">
      <h2>What our users are saying</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card" v-for="(t, i) in testimonials" :key="i">
          <p class="quote">“{{ t.quote }}”</p>
          <p class="author">— {{ t.author }}, {{ t.role }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Top searched specialties section -->
  <section id="specialties">
    <div class="content">
      <h2>Top searched specialties</h2>
      <div class="specialty-grid">
        <div class="specialty-card" v-for="(s, i) in specialties" :key="i">
          <img :src="s.image" :alt="s.label" />
          <p class="label">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Top rated providers section -->
  <section id="top-providers">
    <div class="content">
      <h2>Top‑rated providers</h2>
      <div class="provider-grid">
        <div class="provider-card" v-for="(p, i) in topProviders" :key="i">
          <div class="provider-details">
            <h3 class="provider-name">{{ p.name }}</h3>
            <p class="provider-specialty">{{ p.specialty }}</p>
            <p class="provider-rating">
              <!-- Repeat the star symbol based on the integer portion of the rating -->
              {{ '★'.repeat(Math.floor(p.rating)) }}
              <span v-if="p.rating % 1 !== 0">½</span>
              <span class="rating-value">({{ p.rating.toFixed(1) }})</span>
            </p>
          </div>
          <RouterLink to="/find-provider" class="book-btn">Book now</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Hero styling
 *
 * The hero is the first thing visitors see. A generous height and
 * centered content create a strong impression. CTA buttons are styled
 * consistently with the rest of the application.
 */
/*
 * Hero styling
 *
 * The hero section now uses a two‑column layout.  On small screens it
 * stacks vertically, while on larger screens the copy appears to the left
 * of an illustrative image.  The gradient background and generous height
 * create an inviting first impression.
 */
#hero {
  min-height: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--g-navbar-height);
  /* updated gradient with uplifting, healthcare‑appropriate colours */
  background: linear-gradient(
    to bottom right,
    #e6f9fc,
    #f2f7fb
  );
}

#hero .hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;

  /* Wrap the entire hero content (text and image) in a bordered box. This
     adds a clear outline around the section with a subtle background so
     the content stands apart from the hero gradient. */
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
}

@media (min-width: 768px) {
  #hero .hero-inner {
    flex-direction: row;
    text-align: left;
  }
}

/* Copy column */
#hero .hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

#hero .heading {
  font-family: var(--f-serif);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

#hero .description {
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
  max-width: 65ch;
}

#hero .cta {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

#hero .cta a {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 16rem;
  transition: opacity 75ms ease;
}

#hero .cta a.primary {
  /* primary call‑to‑action uses a calming blue tone instead of dark text */
  background-color: #0078d4;
  color: #ffffff;
}

#hero .cta a.secondary {
  border: 2px solid #0078d4;
  color: #0078d4;
}

#hero .cta a:hover {
  opacity: 0.75;
}

/* Image column */
#hero .hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

#hero .hero-image img {
  width: 100%;
  /* Increase the maximum width of the hero image so it makes a stronger
     visual impact, per feedback that the front image appeared too small. */
  max-width: 34rem;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/*
 * Testimonials styling
 *
 * The testimonials section uses a light background to separate it from
 * the hero. Cards are arranged responsively and have a subtle shadow to
 * create depth.
 */
#testimonials {
  /* Use a very light pastel background instead of relying on the
     default background colour. This helps move away from the
     previous black/white colour scheme toward a more welcoming palette. */
  background-color: #f5faff;
  padding: 4rem 1rem;
}

#testimonials h2 {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.testimonial-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.testimonial-card {
  max-width: 28ch;
  /* Give testimonial cards a clean white backdrop and soft border to
     enhance readability on the light section background. */
  background-color: #ffffff;
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.testimonial-card .quote {
  font-style: italic;
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.testimonial-card .author {
  font-size: 0.875rem;
  font-weight: 600;
  color: oklch(from var(--c-text) l c h / 0.7);
}

/*
 * Specialties section styling
 */
#specialties {
  /* Match the pastel background used elsewhere for visual cohesion. */
  background-color: #f5faff;
  padding: 4rem 1rem;
}

#specialties h2 {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.specialty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.specialty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* White card background with subtle border to contrast against the
     pastel section. */
  background-color: #ffffff;
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.specialty-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.specialty-card img {
  width: 100%;
  /* Make the specialty images taller to draw more attention to each
     discipline. This change responds to feedback that the pictures
     felt too small. */
  height: 12rem;
  object-fit: cover;
}

.specialty-card .label {
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
}

/*
 * Top providers section styling
 */
#top-providers {
  padding: 4rem 1rem;
  /* Light background to distinguish the top providers section. */
  background-color: #f5faff;
}

#top-providers h2 {
  font-family: var(--f-serif);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.provider-card {
  /* Use a white card with a subtle border for consistency with the
     specialties and testimonial cards. */
  background-color: #ffffff;
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.provider-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

/*
 * Typography
 *
 * Override the global text colour variables within this component to ensure
 * high contrast on the light backgrounds. Without these overrides the
 * default colour scheme from the broader application may produce
 * extremely pale or illegible text. Use a dark blue tone for all
 * headings and body copy in this view.
 */
#hero .heading,
#hero .description,
#testimonials h2,
.testimonial-card .quote,
.testimonial-card .author,
#specialties h2,
.specialty-card .label,
#top-providers h2,
.provider-name,
.provider-specialty,
.provider-rating {
  color: #0a2441;
}

.provider-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.provider-specialty {
  font-size: 1rem;
  /* Remove explicit colour definition so the global override above
     applies. This ensures the provider specialty text remains dark and
     legible on the light background. */
  margin: 0 0 0.5rem 0;
}

.provider-rating {
  font-size: 1rem;
  /* Use a warm gold colour for the star symbols to help them stand
     out on the light background. The rating numeric value below uses
     a subdued blue to harmonize with the rest of the palette. */
  color: #f5a623;
}

.provider-rating .rating-value {
  margin-left: 0.25rem;
  font-size: 0.875rem;
  color: #6b7c93;
}

.book-btn {
  align-self: flex-start;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
  /* Match the main call‑to‑action blue used in the hero for the
     provider booking button. White text ensures readability on the
     coloured background. */
  background-color: #0078d4;
  color: #ffffff;
  transition: opacity 75ms ease;
  text-decoration: none;
}

.book-btn:hover {
  opacity: 0.75;
}
</style>

<!--
  Global style override
  
  The default layout of the application uses a dark background on the
  `<body>`, which created large black borders on either side of the
  landing page when we introduced light section backgrounds. To ensure
  a consistent look across the entire viewport, apply a global body
  background colour that matches the light palette used in this page.
-->
<style>
body {
  background-color: #f5faff;
}
</style>