<script setup lang="ts">
import { journey, features } from '@/data/static/clinics-page.json'

const auth = useAuthStore()

function scrollToDashboard() {
  const dashboardSection = document.getElementById('dashboard')
  if (dashboardSection) {
    dashboardSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <main id="clinics" class="content-lanes">
    <section id="hero">
      <h1 class="title">Get more of the right patients, without the admin overhead</h1>
      <p class="description">
        PhysioFind connects your clinic with patients based on real needs, availability, and
        coverage—so you spend less time filtering and more time treating.
      </p>
      <div class="cta-area">
        <RouterLink
          v-if="auth.profile?.role === 'clinic'"
          to="/clinic/dashboard"
          class="cta-btn bordered"
        >
          View your dashboard
        </RouterLink>
        <RouterLink v-else to="/auth?mode=sign-up&role=clinic" class="cta-btn bordered">
          Create your clinic profile
        </RouterLink>
        <button class="cta-btn bordered secondary" @click="scrollToDashboard">
          See how it works
        </button>
      </div>
    </section>
    <section id="journey" class="full-with-lanes">
      <h2 class="title">How It Works</h2>
      <div class="journey-steps">
        <div v-for="(step, i) in journey" :key="i" class="step">
          <div class="number">{{ i + 1 }}</div>
          <h3 class="title">{{ step.title }}</h3>
          <p class="body">{{ step.body }}</p>
        </div>
      </div>
    </section>
    <section id="dashboard">
      <h2 class="title">Your clinic dashboard, simplified</h2>
      <img src="/images/dashboard-preview.webp" alt="Dashboard preview" class="preview-img" />
      <ul class="features-list">
        <li v-for="(feature, i) in features" :key="i" class="check">{{ feature }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
@scope (#clinics) {
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

    .cta-area {
      display: flex;
      gap: 1.5rem;

      .cta-btn {
        margin-block-start: 0.75rem;
        padding: 0.75rem 1.5rem;
        font-size: 1.25rem;
      }
    }
  }

  #journey {
    background: var(--c-bg-secondary);
  }

  #dashboard {
    display: grid;
    grid-template-columns: 3fr 2fr;
    align-items: center;
    gap: 3rem;

    .title {
      grid-column: 1 / -1;
    }

    .preview-img {
      width: 100%;

      border: 0.5px solid var(--c-separator);
      border-radius: 1.5rem;
      box-shadow: 0 1rem 5rem oklch(0 0 0 / 0.12);

      -webkit-user-drag: none;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      list-style: none;
      font-size: 1.25rem;
    }
  }
}
</style>
