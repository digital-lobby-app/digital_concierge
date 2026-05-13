<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

defineProps<{
  open: boolean;
  title: string;
  hint?: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-shell">
      <div v-if="open" class="modal-shell-root">
        <div class="backdrop" @click="$emit('close')" />

        <div class="modal">
          <button class="close-btn" type="button" aria-label="Close" @click="$emit('close')">
            <IconX :size="18" stroke="1.5" />
          </button>

          <h3 class="title">{{ title }}</h3>
          <p v-if="hint" class="hint">{{ hint }}</p>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-shell-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal {
  position: relative;
  width: min(90vw, 480px);
  max-height: 85vh;
  background: var(--surface);
  color: var(--text);
  border-radius: 16px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.25);
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: transparent;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 99rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0;
  font-size: 1.1rem;
}

.hint {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Shared form styles for slotted content */
.modal :slotted(.form) {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  flex: 1;
  min-height: 0;
}

.modal :slotted(.field) {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8rem;
}

.modal :slotted(.field-grow) {
  flex: 1;
  min-height: 0;
}

.modal :slotted(.label) {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: 500;
}

.modal :slotted(.counter) {
  font-size: 0.7rem;
  opacity: 0.6;
  font-weight: 400;
}

.modal :slotted(input),
.modal :slotted(textarea) {
  font: inherit;
  font-size: 0.9rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--surface);
  color: var(--text);
}

.modal :slotted(.field-grow textarea) {
  flex: 1;
  resize: none;
  min-height: 0;
}

.modal :slotted(input:focus),
.modal :slotted(textarea:focus) {
  outline: none;
  border-color: color-mix(in srgb, var(--text) 40%, transparent);
}

.modal :slotted(.rating-row) {
  display: inline-flex;
  gap: 0.2rem;
}

.modal :slotted(.star-btn) {
  background: transparent;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal :slotted(.submit-btn) {
  align-self: flex-end;
  background: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 99rem;
  padding: 0.7rem 2rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
}

.modal :slotted(.submit-btn:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-shell-enter-active,
.modal-shell-leave-active {
  transition: opacity 0.25s ease;
}

.modal-shell-enter-active .modal,
.modal-shell-leave-active .modal {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-shell-enter-from,
.modal-shell-leave-to {
  opacity: 0;
}

.modal-shell-enter-from .modal {
  transform: scale(0.92);
}

.modal-shell-leave-to .modal {
  transform: scale(0.96);
}
</style>
