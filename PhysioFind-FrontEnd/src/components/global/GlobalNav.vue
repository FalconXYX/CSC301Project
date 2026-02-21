<script setup lang="ts">
import PhysioFindLogo from '@/assets/physiofind.svg?component'
</script>

<template>
  <div class="global-nav content-lanes">
    <nav>
      <RouterLink to="/" class="home-btn">
        <PhysioFindLogo class="icon" />
        <span class="title">PhysioFind</span>
      </RouterLink>
      <div class="pages">
        <RouterLink to="#" class="nav-btn">Patients</RouterLink>
        <RouterLink to="#" class="nav-btn">Clinics</RouterLink>
        <RouterLink to="#" class="nav-btn">About Us</RouterLink>
      </div>
      <button class="account-btn">
        <span class="material-symbols-outlined icon">account_circle</span>
      </button>
    </nav>
  </div>
</template>

<style>
.global-nav {
  position: fixed;
  top: 0;

  width: 100%;
  height: var(--g-navbar-height);
  align-content: center;

  background-color: oklch(from var(--c-bg) l c h / 0.92);
  backdrop-filter: blur(0.375rem);

  z-index: 10;

  nav {
    max-width: var(--g-max-width);
    height: 100%;

    margin: 0 auto;

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;

    .pages {
      display: flex;
      gap: 0.5rem;
    }

    a,
    button {
      transition: opacity 75ms ease;

      &:hover {
        opacity: 0.67;
      }
    }

    .home-btn {
      justify-self: start;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .title {
        font-family: var(--f-serif);
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    .account-btn {
      justify-self: end;
      height: 1.75rem;
    }

    .nav-btn {
      padding: 0.375rem 0.75rem;
      font-weight: 500;
    }

    .icon {
      width: 1.75rem;
      height: 1.75rem;

      font-size: 1.75rem;
    }
  }
}
</style>
