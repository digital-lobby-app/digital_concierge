<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IconStar, IconStarFilled } from '@tabler/icons-vue';
import ModalShell from './ModalShell.vue';

type SubmitPayload = {
  rating: number;
  comment: string;
  reviewerName?: string;
};

const props = defineProps<{
  open: boolean;
  poiName?: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: SubmitPayload];
}>();

const rating = ref(1);
const comment = ref('');
const reviewerName = ref('');

const commentTrimmed = computed(() => comment.value.trim());
const reviewerNameTrimmed = computed(() => reviewerName.value.trim());

const canSubmit = computed(() => {
  return rating.value >= 1
    && rating.value <= 5
    && commentTrimmed.value.length >= 1
    && commentTrimmed.value.length <= 128
    && reviewerNameTrimmed.value.length <= 16;
});

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    rating.value = 1;
    comment.value = '';
    reviewerName.value = '';
  }
});

function onSubmit() {
  if (!canSubmit.value) return;
  const payload: SubmitPayload = {
    rating: rating.value,
    comment: commentTrimmed.value,
  };
  if (reviewerNameTrimmed.value.length > 0) {
    payload.reviewerName = reviewerNameTrimmed.value;
  }
  emit('submit', payload);
}
</script>

<template>
  <ModalShell
    :open="open"
    :title="poiName ? `Review ${poiName}` : 'Add a review'"
    hint="Share your experience with other guests."
    @close="emit('close')"
  >
    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
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

      <div class="field">
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
          Comment<span class="counter">{{ commentTrimmed.length }}/128</span>
        </span>
        <textarea
          v-model="comment"
          maxlength="128"
          placeholder="What did you like (or not like) about this place?"
          required
        />
      </label>

      <button type="submit" class="submit-btn" :disabled="!canSubmit">
        Post review
      </button>
    </form>
  </ModalShell>
</template>
