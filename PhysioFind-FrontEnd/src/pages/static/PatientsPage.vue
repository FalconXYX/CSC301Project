<script setup lang="ts">
import { journey, benefits } from '@/data/static/patients-page.json'
</script>

<template>
  <main id="patients" class="content-lanes">
    <section id="hero">
      <h1 class="title">Care that actually fits you</h1>
      <p class="description">
        We match you with providers who align with your needs, insurance, and schedule—so you can
        book with confidence.
      </p>
      <RouterLink to="/find-provider" class="cta-btn bordered">Find your match</RouterLink>
    </section>
    <section id="journey" class="full-with-lanes">
      <h2 class="title">How It Works</h2>
      <ul class="journey-steps">
        <li v-for="(step, i) in journey" :key="i" class="step">
          <div class="number">{{ i + 1 }}</div>
          <h3 class="title">{{ step.title }}</h3>
          <p class="body">{{ step.body }}</p>
        </li>
      </ul>
    </section>
    <section id="benefits">
      <h2 class="title">Why Us?</h2>
      <ul class="benefits-list">
        <li v-for="(benefit, i) in benefits" :key="i" class="check">{{ benefit }}</li>
      </ul>
    </section>
  </main>
</template>

<style>
@scope (#patients) {
  #hero {
    position: relative;
    padding-block: calc(5rem + var(--g-navbar-height)) 5rem;

    display: grid;
    place-content: center;
    place-items: center;
    gap: 1.5rem;

    text-align: center;

    .description {
      max-width: 60ch;

      font-size: 1.25rem;
      line-height: 1.4;
      text-wrap: balance;
    }

    .cta-btn {
      margin-block-start: 0.75rem;
      padding: 0.75rem 1.5rem;
      font-size: 1.25rem;
    }
  }

  #journey {
    background: var(--c-bg-secondary);
  }

  #benefits {
    display: grid;

    .benefits-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem 3rem;

      list-style: none;

      li {
        position: relative;

        display: flex;
        gap: 0.75rem;

        font-size: 1.25rem;
        line-height: 1.4;
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
}
</style>
