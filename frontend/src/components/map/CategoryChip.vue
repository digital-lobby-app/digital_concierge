<script setup lang="ts">
import type { PoiCategory } from '@/services/hotel.service';
import { categoryConfig, categoryIconSvg } from './categoryConfig';

const props = defineProps<{
  category: PoiCategory;
  selected: boolean;
  hideLabelOnMobile?: boolean;
}>();

defineEmits<{
  click: [];
}>();

function iconHtml(): string {
  return categoryIconSvg(props.category, 16, 'currentColor');
}
</script>

<template>
  <button
    type="button"
    class="category-chip"
    :class="{
      'category-chip--on': selected,
      'category-chip--hide-label-mobile': hideLabelOnMobile,
    }"
    :style="{ '--chip-color': categoryConfig[category].color }"
    :aria-pressed="selected"
    @click="$emit('click')"
  >
    <span class="category-chip-icon" v-html="iconHtml()" />
    <span class="category-chip-label">{{ categoryConfig[category].label }}</span>
  </button>
</template>

<style scoped>
.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 99rem;
  border: 1.5px solid var(--chip-color);
  background: transparent;
  color: var(--chip-color);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s, color 0.15s;
}

.category-chip--on {
  background: var(--chip-color);
  color: white;
  opacity: 1;
}

.category-chip-icon {
  display: inline-flex;
}

@media (max-width: 480px) {
  .category-chip--hide-label-mobile .category-chip-label {
    display: none;
  }
  .category-chip--hide-label-mobile {
    padding: 0.5rem;
  }
}
</style>
