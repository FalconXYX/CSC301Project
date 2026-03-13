<script setup lang="ts">
import { renderMarkdown } from '@/utils/renderMarkdown'

const { toasts, remove } = useToaster()
</script>

<template>
  <Teleport to="body">
    <div class="global-toaster">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast--${toast.type}`]">
          <p v-if="toast.html" v-html="toast.html" />
          <p v-else-if="toast.markdown" v-html="renderMarkdown(toast.message)" />
          <p v-else>{{ toast.message }}</p>

          <button class="toast__close" @click="remove(toast.id)">
            <span class="material-symbols-outlined sm">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.global-toaster {
  position: fixed;
  inset-inline: 1.5rem;
  bottom: 1.5rem;
  overflow: visible;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;

  z-index: 100;

  pointer-events: none;

  .toast {
    --bg-opacity: 0.92;
    --fg-color: var(--c-text-secondary);

    position: relative;
    padding: 0.33rem 0.5rem 0.33rem 0.75rem;
    border-radius: 1.5rem;

    display: flex;
    align-items: center;
    gap: 0.25rem;

    width: max-content;
    max-width: 42%;

    background-color: oklch(100% 0 0 / var(--bg-opacity));
    backdrop-filter: blur(4px);
    border: 0.5px solid var(--c-separator);
    box-shadow: 0 2px 2rem rgba(0, 0, 0, 0.17);
    color: var(--fg-color);

    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.2;

    &.toast--success {
      --fg-color: black;
      background-color: oklch(100% 0.12 142 / var(--bg-opacity));
    }

    &.toast--error {
      --fg-color: black;
      background-color: oklch(100% 0.12 17 / var(--bg-opacity));
    }

    .toast__close {
      background: none;
      border: none;

      display: inline-flex;

      pointer-events: all;

      .sm {
        font-size: 20px;
        font-weight: 500;
      }
    }
  }

  /* Enter: slide up from below and fade in */
  .toast-enter-from {
    opacity: 0;
    scale: 0.83;
    transform: translateY(12px);
  }
  .toast-enter-active {
    transition:
      opacity 200ms ease,
      scale 200ms ease,
      transform 200ms ease;
  }
  .toast-enter-to {
    opacity: 1;
    scale: 1;
    transform: translateY(0);
  }

  /* Leave: fade out in place */
  .toast-leave-from {
    opacity: 1;
  }
  .toast-leave-active {
    transition:
      opacity 150ms ease,
      scale 150ms ease;
    /* Take it out of flow so remaining toasts shift smoothly */
    position: absolute;
  }
  .toast-leave-to {
    opacity: 0;
    scale: 0.83;
  }

  /* Smooth shift when a toast is removed mid-stack */
  .toast-move {
    transition: transform 200ms ease;
  }
}
</style>
