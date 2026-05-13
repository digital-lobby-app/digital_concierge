<script setup lang="ts">
import { ref } from 'vue';
import { IconPencil } from '@tabler/icons-vue';
import AddReviewOverlay from '@/components/guestbook/AddReviewOverlay.vue';

const buttonRef = ref<HTMLButtonElement | null>(null);
const buttonRect = ref<DOMRect | null>(null);
const showOverlay = ref(false);

function openOverlay() {
  if (!buttonRef.value) return;
  buttonRect.value = buttonRef.value.getBoundingClientRect();
  showOverlay.value = true;
}

function onSubmit(payload: { name: string; review: string }) {
  console.log('new review:', payload);
  showOverlay.value = false;
}
</script>

<template>
  <div class="guestbook-root">
    <header class="guestbook-header">
      <h3>See what our guests have to say about their stay.</h3>
    </header>
 <!-- TODO: render messages based on db content -->
    <div class="guestbook-messages">
      <div class="message-row">
        <div class="bubble">Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean</div>
      </div>
      <div class="message-row">
        <div class="bubble">Of course! What do you need?</div>
      </div>
      <div class="message-row">
        <div class="bubble">Just checking how this looks. This is some new stuff</div>
      </div>
      <div class="message-row">
        <div class="bubble">Of course! What do you need?</div>
      </div>
      <div class="message-row">
        <div class="bubble">Just checking how this looks. This is some new stuff</div>
      </div>
      <div class="message-row">
        <div class="bubble">Of course! What do you need?</div>
      </div>
      <div class="message-row">
        <div class="bubble">Just checking how this looks. This is some new stuff</div>
      </div>
    </div>

    <footer class="create-review">
      <button ref="buttonRef" class="review-button" @click="openOverlay">
        <IconPencil stroke="1" />
        Write a review
      </button>
    </footer>

    <!-- TODO: Add edit if admin is Authenticated -->

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
/* messages starts here :) */
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
  background: var(--primary);
  color: var(--text);
}

/* footer starts here :) */
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