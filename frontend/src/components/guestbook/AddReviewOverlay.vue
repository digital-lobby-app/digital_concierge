<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { IconX} from '@tabler/icons-vue';
import SendButton from '../ui/sendButton.vue';

const props = defineProps<{
  open: boolean;
  originRect: DOMRect | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', payload: { comment: string; reviewerName?: string }): void;
}>();

const visible = ref(false);
const morphRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const backdropRef = ref<HTMLElement | null>(null);

const reviewerName = ref('');
const comment = ref('');

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    visible.value = true;
    await nextTick();
    openAnim();
  } else if (visible.value) {
    closeAnim();
  }
});

function openAnim() {
  if (!morphRef.value || !contentRef.value || !backdropRef.value || !props.originRect) return;
  const r = props.originRect;

  const finalWidth = Math.min(window.innerWidth * 0.9, 480);
  const finalHeight = Math.min(window.innerHeight * 0.8, 540);
  const finalLeft = (window.innerWidth - finalWidth) / 2;
  const finalTop = r.bottom - finalHeight;

  gsap.set(morphRef.value, {
    top: r.top,
    left: r.left,
    bottom: 'auto',
    right: 'auto',
    width: r.width,
    height: r.height,
    borderRadius: '16px',
    opacity: 1,
  });
  gsap.set(contentRef.value, { opacity: 0 });
  gsap.set(backdropRef.value, { opacity: 0 });

  const tl = gsap.timeline();

  tl.to(backdropRef.value, { opacity: 1, duration: 0.3 }, 0);

  // grow left
  tl.to(morphRef.value, {
    left: finalLeft,
    width: finalWidth,
    duration: 0.35,
    ease: 'power3.inOut',
  }, 0);

  // grow upward
  tl.to(morphRef.value, {
    top: finalTop,
    height: finalHeight,
    borderRadius: '16px',
    duration: 0.45,
    ease: 'power3.out',
  });

  tl.to(contentRef.value, { opacity: 1, duration: 0.25 }, '-=0.2');
}

function closeAnim() {
  if (!morphRef.value || !contentRef.value || !backdropRef.value || !props.originRect) {
    visible.value = false;
    return;
  }
  const r = props.originRect;

  const tl = gsap.timeline({
    onComplete: () => { visible.value = false; },
  });

  tl.to(contentRef.value, { opacity: 0, duration: 0.15 }, 0);

  // top goes back down, height shrinks — bottom stays pinned
  tl.to(morphRef.value, {
    top: r.top,
    height: r.height,
    borderRadius: '16px',
    duration: 0.35,
    ease: 'power3.in',
  }, 0.1);

  // shrink width back to button
  tl.to(morphRef.value, {
    left: r.left,
    width: r.width,
    duration: 0.3,
    ease: 'power3.inOut',
  });

  tl.to(backdropRef.value, { opacity: 0, duration: 0.3 }, '-=0.2');
}

function submitReview() {
  const trimmedComment = comment.value.trim();
  const trimmedName = reviewerName.value.trim();
  if (!trimmedComment) return;
  const payload: { comment: string; reviewerName?: string } = {
    comment: trimmedComment,
  };
  if (trimmedName) payload.reviewerName = trimmedName;
  emit('submit', payload);
  comment.value = '';
  reviewerName.value = '';
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="review-overlay-root">
      <div ref="backdropRef" class="backdrop" @click="emit('close')" />

      <div ref="morphRef" class="morph">
        <div ref="contentRef" class="content">
          <button class="close-btn" type="button" aria-label="Close" @click="emit('close')">
            <IconX :size="18" stroke="1.5" />
          </button>

          <h3 class="title">Write a review</h3>

          <form class="form" @submit.prevent="submitReview">
            <label class="field">
              <span>Your name</span>
              <input v-model="reviewerName" type="text" maxlength="16" placeholder="your name" />
            </label>

            <label class="field field-grow">
              <span>Your review</span>
              <textarea v-model="comment" maxlength="1024" placeholder="Tell us about your stay..." />
            </label>

            <SendButton />

          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.review-overlay-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
}

.morph {
  position: fixed;
  background: var(--surface);
  color: var(--text);
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.25);
  opacity: 0;
}

.content {
  width: 100%;
  height: 100%;
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  opacity: 0;
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
  font-size: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
  min-height: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
}

.field-grow {
  flex: 1;
  min-height: 0;
}

.field input,
.field textarea {
  font: inherit;
  font-size: 0.9rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
  background: var(--surface);
  color: var(--text);
}

.field-grow textarea {
  flex: 1;
  resize: none;
  min-height: 0;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--text) 40%, transparent);
}
</style>
