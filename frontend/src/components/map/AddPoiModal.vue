<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IconStar, IconStarFilled } from '@tabler/icons-vue';
import type { PoiCategory } from '@/services/hotel.service';
import { categoryOrder } from './categoryConfig';
import CategoryChip from './CategoryChip.vue';
import ModalShell from './ModalShell.vue';

type SubmitPayload = {
  category: PoiCategory;
  name: string;
  rating?: number;
  comment?: string;
  reviewerName?: string;
};

const props = defineProps<{
  open: boolean;
  isAdmin?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: SubmitPayload];
}>();

const selectedCategory = ref<PoiCategory>('restaurant');
const name = ref('');
const rating = ref(1);
const comment = ref('');
const reviewerName = ref('');

const nameTrimmed = computed(() => name.value.trim());
const commentTrimmed = computed(() => comment.value.trim());
const reviewerNameTrimmed = computed(() => reviewerName.value.trim());
const canSubmit = computed(() => {
  const nameOk = nameTrimmed.value.length >= 1 && nameTrimmed.value.length <= 32;
  if (!nameOk) return false;
  if (props.isAdmin) {
    return commentTrimmed.value.length <= 128;
  }
  return rating.value >= 1
    && rating.value <= 5
    && commentTrimmed.value.length >= 1
    && commentTrimmed.value.length <= 128
    && reviewerNameTrimmed.value.length <= 16;
});

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    selectedCategory.value = 'restaurant';
    name.value = '';
    rating.value = 1;
    comment.value = '';
    reviewerName.value = '';
  }
});

function onSubmit() {
  if (!canSubmit.value) return;
  const payload: SubmitPayload = {
    category: selectedCategory.value,
    name: nameTrimmed.value,
  };
  if (props.isAdmin) {
    if (commentTrimmed.value.length > 0) payload.comment = commentTrimmed.value;
  } else {
    payload.rating = rating.value;
    payload.comment = commentTrimmed.value;
    if (reviewerNameTrimmed.value.length > 0) {
      payload.reviewerName = reviewerNameTrimmed.value;
    }
  }
  emit('submit', payload);
}
</script>

<template>
  <ModalShell
    :open="open"
    :title="isAdmin ? 'Add a place' : 'Recommend a place'"
    hint="We'll place the pin where you pressed."
    @close="emit('close')"
  >
    <form class="form" @submit.prevent="onSubmit">
      <div class="field">
        <span class="label">Category</span>
        <div class="category-row">
          <CategoryChip
            v-for="cat in categoryOrder"
            :key="cat"
            :category="cat"
            :selected="selectedCategory === cat"
            @click="selectedCategory = cat"
          />
        </div>
      </div>

      <label class="field">
        <span class="label">Name<span class="counter">{{ nameTrimmed.length }}/32</span></span>
        <input
          v-model="name"
          type="text"
          maxlength="32"
          placeholder="e.g. Café de Flore"
          required
        />
      </label>

      <label v-if="!isAdmin" class="field">
        <span class="label">
          Your name (optional)<span class="counter">{{ reviewerNameTrimmed.length }}/16</span>
        </span>
        <input
          v-model="reviewerName"
          type="text"
          maxlength="16"
          placeholder="e.g. Sarah"
        />
      </label>

      <div v-if="!isAdmin" class="field">
        <span class="label">Rating</span>
        <div class="rating-row" role="radiogroup" aria-label="Rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-btn"
            :aria-label="`${star} star${star === 1 ? '' : 's'}`"
            :aria-checked="rating === star"
            @click="rating = star"
          >
            <IconStarFilled v-if="star <= rating" :size="22" />
            <IconStar v-else :size="22" stroke="1.5" />
          </button>
        </div>
      </div>

      <label class="field field-grow">
        <span class="label">
          {{ isAdmin ? 'Comment (optional)' : 'Comment' }}
          <span class="counter">{{ commentTrimmed.length }}/128</span>
        </span>
        <textarea
          v-model="comment"
          maxlength="128"
          :placeholder="isAdmin ? 'A short note from the hotel about this place...' : 'Tell other guests why this place is great...'"
          :required="!isAdmin"
        />
      </label>

      <button type="submit" class="submit-btn" :disabled="!canSubmit">
        Add place
      </button>
    </form>
  </ModalShell>
</template>

<style scoped>
.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
