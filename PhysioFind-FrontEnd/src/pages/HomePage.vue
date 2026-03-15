<script setup lang="ts">
/*
 * Landing Page
 */

const testimonials = [
  {
    quote:
      'As a busy clinic manager, PhysioFind has streamlined our booking process and connected us with more patients than ever.',
    author: 'Laura M.',
    role: 'Clinic Manager',
  },
  {
    quote:
      'I finally found a physio who understands my injury and my insurance coverage - it was so easy!',
    author: 'James K.',
    role: 'Patient',
  },
  {
    quote: 'The matching questionnaire saved me from hours of research. Highly recommend!',
    author: 'Sofia L.',
    role: 'Patient',
  },
]

import heroImg from '../assets/hero.jpg'
import physiotherapistImg from '../assets/physiotherapist.jpg'
import psychologistImg from '../assets/psychologist.jpg'
import chiropractorImg from '../assets/chiropractor.jpg'

const specialties = [
  { label: 'Physiotherapist', image: physiotherapistImg },
  { label: 'Psychologist', image: psychologistImg },
  { label: 'Chiropractor', image: chiropractorImg },
]

const topProviders = [
  { name: 'Dr. Sarah Johnson', specialty: 'Physiotherapist', rating: 5 },
  { name: 'Dr. Miguel Pérez', specialty: 'Psychologist', rating: 5 },
  { name: 'Dr. Emily Chen', specialty: 'Chiropractor', rating: 4.5 },
]
</script>

<template>
  <section id="hero" class="full-with-lanes">
    <div class="hero-inner">
      <div class="hero-text">
        <h1 class="heading">Find the right provider.<br />Not just the closest one.</h1>
        <p class="description">
          PhysioFind connects patients and clinics across Ontario, taking into account your
          insurance, availability and specialty needs. Our matching questionnaire helps identify the
          best practitioner for your unique situation.
        </p>
        <p class="description">
          Whether you're recovering from an injury, seeking mental health support or looking for
          expert skin care, we've got you covered. Book instantly and securely through our platform.
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

  <section id="testimonials" class="full-with-lanes">
    <div class="content">
      <h2>What our users are saying</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card" v-for="(t, i) in testimonials" :key="i">
          <p class="quote">"{{ t.quote }}"</p>
          <p class="author">- {{ t.author }}, {{ t.role }}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="specialties" class="full-with-lanes">
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

  <section id="top-providers" class="full-with-lanes">
    <div class="content">
      <h2>Top-rated providers</h2>
      <div class="provider-grid">
        <div class="provider-card" v-for="(p, i) in topProviders" :key="i">
          <div class="provider-details">
            <h3 class="provider-name">{{ p.name }}</h3>
            <p class="provider-specialty">{{ p.specialty }}</p>
            <p class="provider-rating">
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

<style>
#hero {
  min-height: 50rem;
  place-items: center;
  background: linear-gradient(to bottom right, #e6f9fc, #f2f7fb);
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

  #hero .cta {
    justify-content: flex-start;
  }
}

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
  justify-content: center;
  flex-wrap: wrap;
}

#hero .cta a {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 16rem;
  transition: opacity 75ms ease;
}

#hero .cta a.primary {
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

#hero .hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

#hero .hero-image img {
  width: 100%;
  max-width: 34rem;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

#testimonials,
#specialties,
#top-providers {
  background-color: #f5faff;
  padding: 4rem 1rem;
}

#testimonials h2,
#specialties h2,
#top-providers h2 {
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

.specialty-grid,
.provider-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.specialty-card,
.provider-card {
  background-color: #ffffff;
  border: 1px solid #e0eef9;
  border-radius: 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.specialty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.specialty-card:hover,
.provider-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.specialty-card img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
}

.specialty-card .label {
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
}

.provider-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

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
  margin: 0 0 0.5rem 0;
}

.provider-rating {
  font-size: 1rem;
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
  background-color: #0078d4;
  color: #ffffff;
  transition: opacity 75ms ease;
  text-decoration: none;
}

.book-btn:hover {
  opacity: 0.75;
}

@media (max-width: 900px) {
  .specialty-grid,
  .provider-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .specialty-card,
  .provider-card {
    width: min(100%, 22rem);
  }
}
</style>

<style>
body {
  background-color: #f5faff;
}
</style>
