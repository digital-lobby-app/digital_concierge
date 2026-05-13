<script setup lang="ts">
import type { PoiCategory } from '@/services/hotel.service';
import { categoryOrder } from './categoryConfig';
import CategoryChip from './CategoryChip.vue';

defineProps<{
  selected: Set<PoiCategory>;
}>();

defineEmits<{
  toggle: [category: PoiCategory];
}>();
</script>

<template>
  <div class="filter-chips" role="group" aria-label="Filter map by category">
    <CategoryChip
      v-for="cat in categoryOrder"
      :key="cat"
      :category="cat"
      :selected="selected.has(cat)"
      hide-label-on-mobile
      @click="$emit('toggle', cat)"
    />
  </div>
</template>

<style scoped>
.filter-chips {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.4rem;
  background: var(--surface);
  border-radius: 99rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
</style>
