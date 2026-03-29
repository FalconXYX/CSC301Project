<script setup lang="ts">
import testimonials from '@/data/static/testimonials.json'
import topProviders from '@/data/static/top-providers.json'
</script>

<template>
  <main id="home" class="content-lanes">
    <section id="hero" class="full-with-lanes">
      <h1 class="title">
        <TransitionGroup name="title" appear>
          <span key="item-1">Find the right provider.</span>
          <span key="item-2">Not just the closest one.</span>
        </TransitionGroup>
      </h1>
      <Transition name="cta" appear type="animation">
        <RouterLink to="/find-provider" class="cta-btn bordered">Find a Provider</RouterLink>
      </Transition>
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
      <p class="caption">Like what you see?</p>
      <RouterLink to="/find-provider" class="cta-btn bordered">Find a Provider</RouterLink>
    </section>
  </main>
</template>

<style>
@scope (#home) {
  #hero {
    --t-delay: 400ms;

    position: relative;

    height: 100dvh;
    padding-block: calc(5rem + var(--g-navbar-height)) 5rem;

    background: url('/images/physio-hero.webp') no-repeat left center / cover;

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
      font-size: 1.25rem;
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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 2rem;

    view-timeline: --testimonials-timeline;

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

      animation: fadeInUp;
      animation-timeline: --testimonials-timeline;
      animation-range: calc(sibling-index() * 5% + 10%) calc(sibling-index() * 5% + 30%);
      animation-duration: 1ms;
      animation-fill-mode: both;

      will-change: scale, translate;
      transition:
        box-shadow 300ms ease-out,
        scale 300ms ease-out,
        translate 300ms ease-out;

      &:hover {
        box-shadow: 0 2px 3rem oklch(0 0 0 / 0.08);
        scale: 1.02;
        translate: 0 -0.25rem;
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
    padding-block-start: 1.5rem;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc(10rem + 5dvw), 1fr));
    gap: 2rem;

    view-timeline: --providers-timeline;

    .title {
      grid-column: 1 / -1;
      margin-bottom: 2rem;
    }

    .provider-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      animation: fadeInUp;
      animation-timeline: --providers-timeline;
      animation-range: calc(sibling-index() * 5% + 10%) calc(sibling-index() * 5% + 30%);
      animation-duration: 1ms;
      animation-fill-mode: both;

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
    gap: 0.75rem;

    .caption {
      color: var(--c-secondary);
      font-size: 0.875rem;
    }

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

  @keyframes fadeInUp {
    from {
      opacity: 0;
      translate: 0 1.5rem;
    }
    to {
      opacity: 1;
      translate: 0;
    }
  }

  /* Transitions */

  .title-enter-active {
    transition-property: filter, opacity, translate;
    transition-duration: 750ms;
    transition-delay: calc(400ms * (sibling-index() - 1) + 150ms);
  }

  .title-enter-from {
    filter: blur(4px);
    opacity: 0;
    translate: 0 1.5rem;
  }

  .cta-enter-active {
    animation: scaleIn 1.75s ease;
  }

  @keyframes scaleIn {
    0%,
    67% {
      filter: blur(4px);
      opacity: 0;
      scale: 0.92;
    }
    100% {
      filter: none;
      opacity: 1;
      scale: 1;
    }
  }
}
</style>
