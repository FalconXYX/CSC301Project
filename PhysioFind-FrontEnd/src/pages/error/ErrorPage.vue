<script setup lang="ts">
const route = useRoute()

const errorCode = computed(() => route.query.code ?? '500')

const errorMessage = computed(() => {
  switch (errorCode.value) {
    case '401':
      return 'Not Authenticated'
    case '403':
      return 'Forbidden'
    case '404':
      return 'Page Not Found'
    default:
      return 'An unexpected error occurred'
  }
})

const errorDescription = computed(() => {
  switch (errorCode.value) {
    case '401':
      return 'You need to be logged in to access this page.'
    case '403':
      return 'You are not allowed to access this page.'
    case '404':
      return 'The page you are looking for does not exist.'
    default:
      return 'Please try again later or contact support if the issue persists.'
  }
})
</script>

<template>
  <main id="error-page" class="content-lanes">
    <h1 class="error-code">{{ errorCode }}</h1>
    <div class="error-info">
      <p class="error-message">{{ errorMessage }}</p>
      <p class="error-description">{{ errorDescription }}</p>
    </div>

    <RouterLink to="/" class="home-link">Return to Home</RouterLink>
  </main>
</template>

<style>
#error-page {
  place-items: center;
  place-content: center;
  text-align: center;
  gap: 0.75rem;

  -webkit-user-drag: none;

  .error-code {
    font-size: 5rem;
    font-weight: 700;
    color: var(--c-primary);
  }

  .error-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .error-message {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .error-description {
      color: var(--c-text-secondary);
    }
  }

  .home-link {
    margin-top: 1rem;
    width: fit-content;

    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;

    color: var(--c-bg);
    background-color: var(--c-text);
    font-weight: 500;

    -webkit-user-drag: none;

    transition:
      opacity 150ms ease,
      scale 150ms ease;

    &:hover {
      opacity: 0.83;
      scale: 1.06;
    }

    &:active {
      scale: 0.98;
    }
  }
}
</style>
