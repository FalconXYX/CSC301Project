<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const accountPane = useTemplateRef('account-pane')

const isClinicUser = computed(() => auth.profile?.role === 'clinic')
const hasClinic = computed(() => auth.profile?.clinic_id != null)

function onPopoverClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  const clickedControl = target?.closest("button, a, [role='button']")

  if (clickedControl) {
    accountPane.value?.hidePopover()
  }
}

watch(
  () => route.path,
  () => {
    accountPane.value?.hidePopover()
  },
)
</script>

<template>
  <button
    id="account-btn"
    class="account-btn"
    popovertarget="account-pane"
    popovertargetaction="toggle"
  >
    <slot />
  </button>
  <Teleport to="body">
    <div id="account-pane" popover="auto" ref="account-pane" @click.capture="onPopoverClick">
      <template v-if="auth.user">
        <header class="profile-cell">
          <img src="/images/avatar.png" alt="Profile picture" class="avatar-img" />
          <div class="account-info">
            <p class="greeting">Hello, {{ auth.profile?.first_name }}</p>
            <p class="email">{{ auth.user.email }}</p>
          </div>
        </header>
        <div class="group-cell" v-if="isClinicUser">
          <RouterLink v-if="hasClinic" to="/clinic/dashboard" class="link-cell">
            Clinic Dashboard
          </RouterLink>
          <RouterLink v-else to="/clinic/create" class="link-cell"> Create Clinic </RouterLink>
        </div>
        <div class="group-cell">
          <RouterLink to="/account" class="link-cell">My Account</RouterLink>
          <button class="link-cell danger" @click="auth.signOut">Logout</button>
        </div>
      </template>
      <template v-else>
        <div class="group-cell">
          <RouterLink to="/auth" class="link-cell">Login</RouterLink>
          <RouterLink to="/auth?mode=sign-up" class="link-cell">Register</RouterLink>
        </div>
        <div class="group-cell">
          <p class="group-cell--title">Are you a clinic?</p>
          <RouterLink to="/auth?mode=sign-up&role=clinic" class="link-cell"
            >Register Clinic</RouterLink
          >
        </div>
      </template>
    </div>
  </Teleport>
</template>

<style>
#account-btn {
  anchor-name: --account-anchor;
  display: inline-block;
}

#account-pane {
  position: fixed;
  position-anchor: --account-anchor;
  inset: unset;
  top: anchor(bottom);
  right: anchor(right);

  min-width: 14rem;

  flex-direction: column;

  margin-block-start: 0.75rem;
  padding: 0.5rem;

  background-color: var(--c-bg-secondary);
  border: 0.5px solid var(--c-separator);
  border-radius: 1rem;
  box-shadow: 0 2px 48px hsl(0 0% 0% / 0.17);

  transition:
    opacity 150ms ease,
    translate 150ms ease,
    display 150ms ease allow-discrete;

  @starting-style {
    opacity: 0;
    translate: 0 -4px;
  }

  &:popover-open {
    display: flex;
  }

  &:not(:popover-open) {
    opacity: 0;
    translate: 0 -4px;
  }

  .profile-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    padding-inline: 0.5rem;
    margin-block: 0.5rem 0.33rem;

    -webkit-user-select: none;
    user-select: none;
    pointer-events: none;

    .avatar-img {
      width: 2rem;
      height: 2rem;
      border: 0.5px solid var(--c-separator);
      border-radius: 2rem;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;

      max-lines: 1;
      white-space: nowrap;

      .greeting {
        font-size: 0.875rem;
        font-weight: 500;
      }

      .email {
        color: var(--c-text-secondary);
        font-size: 0.75rem;
      }
    }
  }

  .group-cell {
    display: flex;
    flex-direction: column;

    &:not(:first-child) {
      margin-block-start: 0.33rem;
    }

    &:not(:first-of-type, :has(.group-cell--title))::before {
      content: '';
      margin: 0 0.75rem 0.33rem;
      border-block-start: 0.5px solid var(--c-separator);
    }

    .group-cell--title {
      margin-inline: 0.75rem;
      margin-block: 0.25rem 0.125rem;

      font-size: 0.75rem;
      font-weight: 500;
      color: var(--c-text-secondary);

      -webkit-user-select: none;
      user-select: none;
      pointer-events: none;
    }
  }

  .link-cell {
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;

    transition:
      background-color 150ms ease,
      color 150ms ease;

    &:hover {
      background-color: oklch(from var(--c-bg-secondary) calc(l - 0.04) c h);
    }

    &.danger {
      color: var(--c-red);

      &:hover {
        background-color: oklch(from var(--c-red) l c h / 0.06);
      }
    }
  }
}
</style>
