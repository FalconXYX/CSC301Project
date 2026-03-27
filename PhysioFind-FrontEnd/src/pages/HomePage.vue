<script setup lang="ts">
import testimonials from '@/data/static/testimonials.json'

const topProviders = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Physiotherapist',
    rating: 5,
    photo: '/images/people/sarah.jpg',
  },
  {
    name: 'Dr. Miguel Pérez',
    specialty: 'Psychologist',
    rating: 5,
    photo: '/images/people/miguel.jpg',
  },
  {
    name: 'Dr. Michelle Harris',
    specialty: 'Occupational Therapist',
    rating: 5,
    photo: '/images/people/michelle.jpg',
  },
  {
    name: 'Dr. Emily Chen',
    specialty: 'Chiropractor',
    rating: 4,
    photo: '/images/people/emily.jpg',
  },
]
</script>

<template>
  <main class="content-lanes">
    <section id="hero" class="full-with-lanes">
      <h1 class="title">
        <span>Find the right provider.</span>
        <span>Not just the closest one.</span>
      </h1>
      <RouterLink to="/find-provider" class="cta-btn">Find a Provider</RouterLink>
      <p class="scroll-tip">Scroll down to learn more</p>
    </section>
    <section id="testimonials">
      <h2 class="title">What Our Users Are Saying</h2>
      <div v-for="(testimonial, i) in testimonials" :key="i" class="testimonial-card">
        <p class="quote">{{ testimonial.quote }}</p>
        <p class="author">{{ testimonial.author }}, {{ testimonial.role }}</p>
      </div>
    </section>
    <section id="top-providers">
      <h2 class="title">Top-Rated Providers</h2>
      <div v-for="(provider, i) in topProviders" :key="i" class="provider-card">
        <img :src="provider.photo" :alt="provider.name" class="provider-photo" />
        <h3 class="provider-name">{{ provider.name }}</h3>
        <p class="provider-specialty">{{ provider.specialty }}</p>
        <p class="provider-rating">
          {{ '★'.repeat(Math.floor(provider.rating)) }}
        </p>
      </div>
    </section>
    <section id="find-provider">
      <RouterLink to="/find-provider" class="cta-btn">Find a Provider</RouterLink>
    </section>
  </main>
</template>

<style>
#hero {
  --t-delay: 400ms;

  position: relative;

  height: 100dvh;
  padding-block: calc(3rem + var(--g-navbar-height)) 3rem;

  background: url('/images/physio-hero.webp') no-repeat left center / cover;

  display: grid;
  place-items: center start;

  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;

    background: linear-gradient(
      to bottom,
      oklch(from var(--c-bg) l c h / calc(0.5 + var(--opacity-diff, 0))),
      oklch(from var(--c-bg) l c h / calc(0.33 + var(--opacity-diff, 0))) 25%
    );
    z-index: -1;
  }

  @media (prefers-color-scheme: dark) {
    --opacity-diff: 0.25;
  }

  @media (width < 512px) {
    justify-items: center;
    text-align: center;

    height: round(down, 70dvh, 1px);
  }

  .title {
    font:
      600 4rem/1.1 'Expose',
      sans-serif;

    display: flex;
    flex-direction: column;
    gap: 1.75rem;

    max-width: 14ch;

    @media (width < 512px) {
      font-size: 3rem;
    }
  }

  .cta-btn {
    padding: 0.75rem 1.5rem;

    background: var(--c-primary);
    color: var(--c-bg);
    border-radius: 100px;

    font-size: 1.25rem;
    font-weight: 600;

    will-change: scale;

    transition:
      opacity 300ms ease-out,
      scale 300ms ease-out;

    &:hover {
      opacity: 0.83;
      scale: 1.04;
    }
  }

  .scroll-tip {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);

    font-size: 0.875rem;
    color: var(--c-secondary);
  }
}

#testimonials {
  padding-block: 5rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 2rem;

  @media (width < 900px) {
    grid-template-columns: 1fr;
  }

  .title {
    grid-column: 1 / -1;
    margin-bottom: 1rem;
  }

  .testimonial-card {
    padding: 1.5rem;

    background: var(--c-bg-secondary);
    border-radius: 1.5rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;

    /* animation-name: fadeInUp;
    animation-timeline: view(--testimonials-timeline);
    animation-fill-mode: both; */

    will-change: scale, translate;
    transition:
      scale 300ms ease-out,
      translate 300ms ease-out;

    &:hover {
      scale: 1.02;
      translate: 0 -0.5rem;
      cursor: default;
    }

    .quote {
      font-size: 1.5rem;
      line-height: 1.4;
      font-style: italic;
    }

    .author {
      align-self: end;

      font-size: 0.875rem;
      color: var(--c-secondary);
    }
  }
}

#top-providers {
  padding-block: 1.5rem 5rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(10rem + 5dvw), 1fr));
  gap: 2rem;

  .title {
    grid-column: 1 / -1;
    margin-bottom: 2rem;
  }

  .provider-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    .provider-photo {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 9999px;
      object-fit: contain;

      margin-bottom: 1.5rem;
    }

    .provider-name {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 90%;
    }

    .provider-specialty {
      font-size: 1.125rem;
      line-height: 90%;
      color: var(--c-secondary);
    }

    .provider-rating {
      color: oklch(0.75 0.25 90);
      font-size: 1.25rem;
      letter-spacing: 10%;

      .rating-value {
        color: var(--c-secondary);
        font-size: 0.875rem;
        margin-left: 0.25rem;
      }
    }
  }
}

#find-provider {
  padding-block: 1.5rem 3rem;

  display: grid;
  place-items: center;

  .cta-btn {
    padding: 0.75rem 1.5rem;

    background: var(--c-primary);
    color: var(--c-bg);
    border-radius: 100px;

    font-size: 1.125rem;
    font-weight: 600;

    will-change: scale;

    transition:
      opacity 300ms ease-out,
      scale 300ms ease-out;

    &:hover {
      opacity: 0.83;
      scale: 1.04;
    }
  }
}

/* @keyframes fadeInUp {
  from {
    opacity: 0;
    translate: 0 1.5rem;
  }
  to {
    opacity: 1;
    translate: 0;
  }
} */
</style>
