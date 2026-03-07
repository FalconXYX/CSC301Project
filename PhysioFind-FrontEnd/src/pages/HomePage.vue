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
</script>

<template>
  <!-- Hero section with value proposition and CTA -->
  <section id="hero">
    <div class="hero-inner">
      <h1 class="heading">Find the right physio. Not just the closest one.</h1>
      <p class="subheading">
        PhysioFind matches you with Ontario providers based on availability,
        insurance, location and specialization – then lets you book instantly.
      </p>
      <div class="cta">
        <RouterLink to="/find-provider" class="primary">Find a provider</RouterLink>
        <RouterLink to="#" class="secondary">Learn more</RouterLink>
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
</template>

<style scoped>
/*
 * Hero styling
 *
 * The hero is the first thing visitors see. A generous height and
 * centered content create a strong impression. CTA buttons are styled
 * consistently with the rest of the application.
 */
#hero {
  height: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--g-navbar-height);
  text-align: center;
  /* subtle gradient background using existing colour variables */
  background: linear-gradient(
    to bottom right,
    oklch(from var(--c-bg) l c h / 1),
    oklch(from var(--c-text) l c h / 0.07)
  );
}

#hero .hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 72ch;
  margin: 0 auto;
}

#hero .heading {
  font-family: var(--f-serif);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

#hero .subheading {
  font-size: 1.25rem;
  line-height: 1.5;
  max-width: 60ch;
  margin: 0;
}

#hero .cta {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

#hero .cta a {
  padding: 0.75rem 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 16rem;
  transition: opacity 75ms ease;
}

#hero .cta a.primary {
  background-color: var(--c-text);
  color: var(--c-bg);
}

#hero .cta a.secondary {
  outline: 2px solid var(--c-text);
  color: var(--c-text);
}

#hero .cta a:hover {
  opacity: 0.75;
}

/*
 * Testimonials styling
 *
 * The testimonials section uses a light background to separate it from
 * the hero. Cards are arranged responsively and have a subtle shadow to
 * create depth.
 */
#testimonials {
  background-color: oklch(from var(--c-bg) l c h / 0.97);
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
  background: var(--c-bg);
  border: 1px solid oklch(from var(--c-text) l c h / 0.1);
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
</style>