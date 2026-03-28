<script setup lang="ts">
import PhysioFindLogo from '@/assets/physiofind.svg?component'
import { problems } from '@/data/static/about-page.json'
</script>

<template>
  <main id="about" class="content-lanes">
    <section id="hero">
      <div class="text-area">
        <h1 class="title">Finding the right care shouldn't be hard</h1>
        <p class="description">
          With PhysioFind, we're building a better way to connect patients with the right
          providers—based on real needs, not guesswork.
        </p>
      </div>
      <PhysioFindLogo class="logo" />
    </section>
    <section id="problem" class="full-with-lanes">
      <h2 class="title">The Problem</h2>
      <p class="statement">Finding physiotherapy care today is harder than it should be.</p>
      <div class="side-by-side">
        <div v-for="(problem, i) in problems" :key="i" class="column">
          <h3>{{ problem.title }}&hellip;</h3>
          <ul>
            <li v-for="item in problem.items" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section id="were-building">
      <h2 class="title">What We're Building</h2>
      <p class="statement">PhysioFind is a smarter way to connect patients and providers.</p>
    </section>
    <section id="vision" class="full-with-lanes">
      <p class="statement">
        We believe in a healthcare experience where finding and booking care is simple, transparent,
        and personalized—just the way it should be.
      </p>
    </section>
    <section id="contact">
      <p class="caption">Want to learn more or get involved?</p>
      <a href="mailto:support@physiofind.com" class="bordered">Contact Us</a>
    </section>
  </main>
</template>

<style scoped>
@scope (#about) {
  #hero {
    position: relative;
    padding-block-start: calc(var(--g-navbar-height) + 5rem);

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;

    .text-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .title {
        text-wrap: balance;
      }

      .description {
        font-size: 1.25rem;
        line-height: 1.4;
        text-wrap: balance;
      }
    }

    .logo {
      height: 120%;
      animation: pulse 4s ease 500ms infinite;
    }
  }

  #problem {
    background: var(--c-bg-secondary);

    .statement {
      font-size: 1.5rem;
      line-height: 1.4;
      text-wrap: pretty;
    }

    .side-by-side {
      display: flex;
      gap: 3rem;

      .column {
        flex: 1;
        padding: 1.5rem;

        border: 1px solid var(--c-separator);
        border-radius: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        ul {
          padding-inline-start: 1.5rem;

          display: flex;
          flex-direction: column;
          gap: 0.75rem;

          list-style: disc;
          font-size: 1.25rem;
        }
      }
    }
  }

  #were-building {
    display: grid;
    row-gap: 3rem;

    .statement {
      font-size: 1.5rem;
      line-height: 1.4;
      text-wrap: pretty;
    }
  }

  #vision {
    background: var(--c-bg-secondary);

    .statement {
      font:
        400 2.5rem/1.4 'Expose',
        sans-serif;
      text-wrap: pretty;
    }
  }

  #contact {
    padding-block: 3rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    .caption {
      color: var(--c-secondary);
      font-size: 0.875rem;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.7;
    }
  }
}
</style>
