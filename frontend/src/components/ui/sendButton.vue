<script setup lang="ts">
import { IconSend } from '@tabler/icons-vue'

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="submit"
    class="post-btn"
    aria-label="Send"
    @click="$emit('click')"
  >
    <IconSend stroke="1" />
  </button>
</template>

<style scoped>
.post-btn {
  align-self: flex-end;
  background: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 99rem;
  padding: 0.6rem 1.8rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.85rem;
}
</style>
