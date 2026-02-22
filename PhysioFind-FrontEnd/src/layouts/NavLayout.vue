<template>
  <GlobalNav />
  <main class="content-lanes">
    <RouterView />
  </main>
  <GlobalFooter />
</template>

<style>
html,
body {
  max-width: 100dvw;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
}

main {
  flex: 1;

  > :first-child {
    padding-top: var(--g-navbar-height);
  }

  /* > :last-child {
    padding-bottom: var(--g-footer-height);
  } */
}
</style>
