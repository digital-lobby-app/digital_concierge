<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { IconPencil } from '@tabler/icons-vue';
import AddReviewOverlay from '@/components/guestbook/AddReviewOverlay.vue';
import {
  createGuestbookReview,
  fetchGuestbookReviews,
  type Review,
} from '@/services/review.service';
import { useHotelStore } from '@/stores/hotel';

const hotelStore = useHotelStore();
const { slug } = storeToRefs(hotelStore);

const buttonRef = ref<HTMLButtonElement | null>(null);
const buttonRect = ref<DOMRect | null>(null);
const showOverlay = ref(false);
const reviews = ref<Review[]>([]);

onMounted(async () => {
  if (!slug.value) return;
  try {
    reviews.value = await fetchGuestbookReviews(slug.value);
  } catch (err) {
    console.error('failed to load guestbook reviews', err);
  }
});

function openOverlay() {
  if (!buttonRef.value) return;
  buttonRect.value = buttonRef.value.getBoundingClientRect();
  showOverlay.value = true;
}

async function onSubmit(payload: { comment: string; reviewerName?: string }) {
  if (!slug.value) return;
  try {
    const review = await createGuestbookReview(slug.value, payload);
    reviews.value = [review, ...reviews.value];
    showOverlay.value = false;
  } catch (err) {
    console.error('failed to submit guestbook review', err);
  }
}

function formatReviewDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
</script>

<template>
  <div class="guestbook-root">
    <header class="guestbook-header">
      <h3>See what our guests have to say about their stay.</h3>
    </header>
    <div class="guestbook-messages">
      <div v-for="review in reviews" :key="review.id" class="message-row">
        <div class="bubble">
          <p class="bubble-comment">{{ review.comment }}</p>
          <small class="bubble-meta">
            <span v-if="review.reviewerName">{{ review.reviewerName }}</span>
            <span>{{ formatReviewDate(review.createdAt) }}</span>
          </small>
        </div>
      </div>
    </div>

    <footer class="create-review">
      <button ref="buttonRef" class="review-button" @click="openOverlay">
        <IconPencil stroke="1" />
        Write a review
      </button>
    </footer>

    <AddReviewOverlay
      :open="showOverlay"
      :origin-rect="buttonRect"
      @close="showOverlay = false"
      @submit="onSubmit"
      />
  </div>
</template>

<style scoped>
.guestbook-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--text);
}

.guestbook-header {
  display: flex;
  margin-bottom: 0.4rem;
  flex-shrink: 0;
}

.guestbook-messages {
  flex: 1;
  min-height: 0;
  padding: 1.4rem 0rem 6rem 0rem;
  margin-bottom: -4rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    var(--bg) 1.5rem,
    var(--bg) calc(100% - 1.5rem),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    var(--bg) 1rem,
    var(--bg) calc(100% - 5rem),
    transparent 100%
  );
}

.guestbook-messages::-webkit-scrollbar {
  display: none;
}

.message-row {
  display: flex;
  justify-content: center;
}

.bubble {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
}

.bubble-comment {
  margin: 0;
}

.bubble-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.4rem;
  opacity: 0.7;
  font-size: 0.75rem;
}

.create-review {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  flex-shrink: 0;
}

.review-button {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  border-radius: 99rem;
  padding: 0.7rem 2rem;

  background-color: var(--surface);
  color: var(--text);
  cursor: pointer;
  border: none;

  filter: drop-shadow(0px 0px 13px color-mix(in srgb, var(--surface) 40%, transparent));
}
</style>