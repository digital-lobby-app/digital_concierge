<script setup lang="ts">
import gsap from 'gsap'
import { onBeforeUnmount, ref, watch } from 'vue'

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  pending?: boolean
  error?: boolean
}

const props = defineProps<{
  message: Message
}>()

const dotsRef = ref<HTMLElement | null>(null)
let tl: gsap.core.Timeline | null = null

function killTimeline() {
  if (tl) {
    tl.kill()
    tl = null
  }
}

function startTimeline() {
  killTimeline()
  const el = dotsRef.value
  if (!el) return

  const dots = el.querySelectorAll('.typing-dot')
  if (!dots.length) return

  // reset to a known state
  gsap.set(dots, { y: 0, opacity: 0.4 })

  tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
  tl.to(dots, {
    y: -4,
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out',
    stagger: 0.15,
  }).to(dots, {
    y: 0,
    opacity: 0.4,
    duration: 0.35,
    ease: 'power2.in',
    stagger: 0.15,
  }, '-=0.4')
}

watch(
  () => props.message.pending,
  async (isPending) => {
    if (isPending) {
      // wait for the dots to be in the DOM
      await Promise.resolve()
      startTimeline()
    } else {
      killTimeline()
    }
  },
  { immediate: true },
)

onBeforeUnmount(killTimeline)
</script>

<template>
  <div class="message-row" :class="message.role">
    <div class="bubble" :class="{ pending: message.pending }">
      <template v-if="message.pending">
        <span ref="dotsRef" class="typing-dots">
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </span>
      </template>
      <template v-else>
        {{ message.content }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.message-row {
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.assistant {
  justify-content: flex-start;
}

.bubble {
  padding: 0.65rem 1rem;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-row.user .bubble {
  background: var(--accent);
  color: var(--font);
  border-bottom-right-radius: 0px;
}

.message-row.assistant .bubble {
  background: var(--text);
  color: var(--bg);
  border-bottom-left-radius: 0px;
}

.bubble.pending {
  padding: 0.85rem 1rem;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.4;
  display: inline-block;
}
</style>
