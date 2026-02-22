<template>
  <section id="hero">
    <div class="title-content">
      <h1 class="heading">Find the right physio. Not just the closest one.</h1>
      <p class="subheading">
        PhysioFind matches you with Ontario providers based on availability, insurance, location,
        and specialization &ndash; then lets you book instantly.
      </p>
    </div>
    <div class="cta">
      <RouterLink to="/find-provider" class="primary">Find a provider</RouterLink>
      <RouterLink to="#" class="secondary">Learn More</RouterLink>
    </div>
  </section>
</template>

<style scoped>
#hero {
  height: 40rem;
  align-content: center;
  padding-top: var(--g-navbar-height);

  .title-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    text-align: center;
    margin-bottom: 1.5rem;

    .heading {
      font: 700 2.5rem/1.2 var(--f-serif);
    }

    .subheading {
      max-width: 64ch;

      font-size: 1.25rem;
      line-height: 1.4;
      text-wrap: pretty;
    }
  }

  .cta {
    display: flex;
    justify-content: center;
    gap: 1.5rem;

    a {
      padding: 0.75rem 1.125rem;
      font-size: 1.125rem;
      font-weight: 600;

      border-radius: 16rem;

      transition: opacity 75ms ease;

      &:hover {
        opacity: 0.75;
      }

      &.primary {
        background-color: var(--c-text);
        color: var(--c-bg);
      }

      &.secondary {
        outline: 2px solid var(--c-text);
        color: var(--c-text);
      }
    }
  }
}
</style>
