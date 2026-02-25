<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

const { title, type } = defineProps<{
  title: string
  type: InputTypeHTMLAttribute
}>()

const content = defineModel<string>({
  required: true,
})

const fieldRef = useTemplateRef('field')
const originalContent = content.value

const isEditing = ref(false)
const hasChanges = computed(() => !isEditing.value && content.value !== originalContent)

function toggleEditing() {
  isEditing.value = !isEditing.value

  if (isEditing.value) {
    nextTick(() => {
      fieldRef.value?.focus()
    })
  }
}

defineExpose({ isEditing, hasChanges })
</script>

<template>
  <label class="editable-cell" :changed="hasChanges ? '' : null">
    {{ title }}
    <input :type="type" :disabled="!isEditing" v-model="content" ref="field" />
    <button type="button" @click="toggleEditing" class="toggle-btn">
      <span class="material-symbols-outlined sm">
        {{ isEditing ? 'check' : 'edit' }}
      </span>
    </button>
  </label>
</template>

<style scoped>
.editable-cell {
  display: flex;
  gap: 0.5rem;

  align-items: center;

  font-weight: 500;
  padding-block: 0.75rem;

  /* &:not(:last-of-type) {
    border-bottom: 0.5px solid var(--c-separator);
  } */

  input {
    appearance: none;
    border: none;
    flex: 1;

    background: none;
    color: var(--c-text);

    outline: none;

    font-size: inherit;
    text-align: end;

    &:not(:focus),
    &:disabled {
      color: var(--c-text-secondary);
    }
  }

  &[changed] input {
    color: var(--c-accent);
  }

  .toggle-btn {
    color: var(--c-accent);
    display: flex;
  }
}
</style>
