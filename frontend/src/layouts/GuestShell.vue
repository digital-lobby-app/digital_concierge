<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GuestDashboardView from '@/views/guest/GuestDashboardView.vue'
import { useOverlayBack } from '@/useSlideOverlay'
import { IconArrowLeft } from '@tabler/icons-vue'
import gsap from 'gsap'

const { back } = useOverlayBack()
const route = useRoute()
const isOverlay = computed(() => route.meta.overlay === true)

console.log(route.meta)
console.log(route.matched)

//gsap animations
function onEnter(el: Element, done: () => void) {
  gsap.fromTo(el,
    { y: '100%' },
    {
      y: '0%',
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: done,
    }
  )
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, {
    y: '100%',
    duration: 0.4,
    ease: 'power3.inOut',
    onComplete: done,
  })
}

function onContentEnter(el: Element, done: () => void) {
  gsap.fromTo(el,
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      delay: 0.6,
      onComplete: done,
    }
  )
}

function onContentLeave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    duration: 0.15,
    ease: 'power1.in',
    onComplete: done,
  })
}
</script>

<template>
  <GuestDashboardView />

  <Teleport to="body">
    <Transition
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="isOverlay" class="overlay">
        <div class="module-header">
          <button class="back-btn" @click="back">
            <IconArrowLeft class="icon" stroke={2} />
            <span>Back</span>
          </button>
        </div>

        <Transition
          :css="false"
          @enter="onContentEnter"
          @leave="onContentLeave"
          appear
        >
          <div class="content">
            <RouterView />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 1rem 1rem 0 1rem;
  border-radius: 20px 20px 0 0;
  z-index: 50;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}

.module-header {
  flex-shrink: 0;
  padding: 1.25rem 1.5rem;
}

.content {
  flex: 1;
  overflow-y: auto;
  border: 3px solid red;
  padding: 0rem 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.7rem 1rem;
  border: none;
  border-radius: 999px;

  background: whitesmoke;
  color: black;
  cursor: pointer;
}

@media (max-width: 768px) {
  .overlay {
    inset: 2rem 0.4rem 0 0.4rem;
    border-radius: 16px 16px 0 0;
  }

  .module-header {
    padding: 1rem 1.25rem;
  }
}
</style>