<script setup lang="ts">
import PhysioFindLogo from '@/assets/physiofind.svg?component'

const authStore = useAuthStore()

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div id="global-nav" class="content-lanes" :class="{ scrolled }">
    <nav>
      <RouterLink to="/" class="home-btn">
        <PhysioFindLogo class="icon" />
        <span class="title">PhysioFind</span>
      </RouterLink>
      <div class="pages">
        <RouterLink to="/patients" class="nav-btn">Patients</RouterLink>
        <RouterLink to="/clinics" class="nav-btn">Clinics</RouterLink>
        <RouterLink to="/about" class="nav-btn">About Us</RouterLink>
      </div>
      <AccountPane>
        <img
          v-if="authStore.isAuthenticated"
          src="/images/avatar.png"
          alt="Profile picture"
          class="icon"
        />
        <span v-else class="material-symbols-outlined icon">account_circle</span>
      </AccountPane>
    </nav>
  </div>
</template>

<style>
#global-nav {
  position: fixed;
  top: 0;

  width: 100%;
  height: var(--g-navbar-height);
  align-content: center;

  z-index: 10;

  transition:
    background-color 300ms ease,
    backdrop-filter 300ms ease;

  &.scrolled {
    background: oklch(from var(--c-bg) l c h / 0.92);
    backdrop-filter: blur(0.375rem);
  }

  nav {
    max-width: var(--g-max-width);
    width: 100%;
    height: 100%;

    margin: 0 auto;

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;

    .pages {
      display: flex;
      gap: 0.5rem;
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
      display: inline-flex;
      justify-self: end;
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

    img.icon {
      width: 2rem;
      height: 2rem;
      object-fit: cover;

      border: 1px solid var(--c-separator);
      border-radius: 1.75rem;
    }
  }
}

@scope (#global-nav nav) to (#account-pane) {
  a,
  button {
    transition: opacity 75ms ease;

    &:hover {
      opacity: 0.67;
    }
  }
}
</style>
