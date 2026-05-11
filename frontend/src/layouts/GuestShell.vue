<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import GuestDashboardView from '@/views/guest/GuestDashboardView.vue'
import { useOverlayBack } from '@/composables/useSlideOverlay'
import { IconArrowLeft } from '@tabler/icons-vue'
import gsap from 'gsap'

const { back } = useOverlayBack()
const route = useRoute()
const isOverlay = computed(() => route.meta.overlay === true)

// Drag-to-close state
const overlayEl = ref<HTMLElement | null>(null)
const dragStartY = ref(0)
const currentDragY = ref(0)
const isDragging = ref(false)
const CLOSE_THRESHOLD = 120 // px dragged to trigger close
const DRAG_ZONE_HEIGHT = 80 // px from top of overlay that initiates drag

function isMobileOrTablet() {
  return window.innerWidth <= 1024
}

function onTouchStart(e: TouchEvent) {
  if (!isMobileOrTablet()) return
  const touch = e.touches[0]
  // Only start drag if touching near top
  const rect = overlayEl.value?.getBoundingClientRect()
  if (!rect) return
  const relativeY = touch.clientY - rect.top
  if (relativeY > DRAG_ZONE_HEIGHT) return

  isDragging.value = true
  dragStartY.value = touch.clientY
  currentDragY.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const touch = e.touches[0]
  const delta = touch.clientY - dragStartY.value
  if (delta < 0) return // don't allow dragging up

  currentDragY.value = delta

   if (overlayEl.value) {
    // Apply resistance: feel heavier as you drag more
    const resistedDelta = delta * (1 - delta / (window.innerHeight * 2))
    overlayEl.value.style.transform = `translateY(${Math.max(0, resistedDelta)}px)`
    // Fade out slightly as dragged
    const opacity = Math.max(0.4, 1 - delta / 400)
    overlayEl.value.style.opacity = String(opacity)
  } 
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  if (currentDragY.value >= CLOSE_THRESHOLD) {
    // Animate out and close
    if (overlayEl.value) {
      gsap.to(overlayEl.value, {
        y: '100%',
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          back()
        },
      })
    } else {
      back()
    }
  } else {
    // Snap back
    if (overlayEl.value) {
      gsap.to(overlayEl.value, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })
    }
  }
  currentDragY.value = 0
}

// GSAP transition hooks
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
      <div
        v-if="isOverlay"
        ref="overlayEl"
        class="overlay"
        @touchstart="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="module-header">
          <div class="drag-handle" aria-hidden="true" />

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
  will-change: transform;
}

.module-header {
  flex-shrink: 0;
  padding: 1.25rem 1.5rem;
  touch-action: none;
}

.drag-handle {
  display: none;
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: #d1d5db;
  margin: 0 auto 0.75rem;
}

.content {
  flex: 1;
  overflow-y: auto;
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

@media (max-width: 1024px) {
  .drag-handle {
    display: block;
  }

  .back-btn {
    display: none;
  }

  .module-header {
    cursor: grab;
  }

  .module-header:active {
    cursor: grabbing;
  }
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