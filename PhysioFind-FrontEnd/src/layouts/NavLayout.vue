<template>
  <GlobalNav />
  <RouterView />
  <GlobalFooter />
</template>

<style>
html,
body {
  max-width: 100dvw;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
}

@layer layout {
  main {
    flex: 1;

    &.content-lanes > section {
      padding-block: 5rem;
      row-gap: 3rem;
    }
  }
}
</style>
