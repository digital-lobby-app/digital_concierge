<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core';
import SettingsView from '@/views/admin/SettingsView.vue';
import { IconSettings, IconX } from '@tabler/icons-vue'
import { useHotelStore } from '@/stores/hotel';


const hotel = useHotelStore()

const settingsOpen = ref(false)
const el = ref<HTMLElement | null>(null)
const screenBounds = ref<HTMLElement | null>(null)
const isDragging = ref(false)

// TODO: fix initialValue defaults if mobile or desktop
const { style } = useDraggable(el, {
  containerElement: screenBounds,
  initialValue: {x: 280, y: 40 },
  preventDefault: true,
  stopPropagation: true,
  onStart: () => { isDragging.value = true },
  onEnd: () => { isDragging.value = false },
})
</script>

<template>
  <div ref="screenBounds" class="drag-bounds">
    <iframe
  :src="`/${hotel.slug}/guest-dashboard`"
  class="preview-frame"
  :style="{ pointerEvents: isDragging ? 'none' : 'auto' }"
/>

    <button
      id="draggable-btn"
      ref="el"
      :style="style"
      @mousedown.prevent
      @click="settingsOpen = !settingsOpen">
      <IconSettings stroke="1.5" />
    </button>

    <!-- Settings panel -->
    <div v-if="settingsOpen" id="settings-overlay" aria-hidden="true"></div>
    <div v-if="settingsOpen"  id="settings-card">
      <div id="title-wrapper">
        <h2>Settings</h2>
        <button class="close-btn" @click="settingsOpen = false">
          <IconX stroke="1.5" />
        </button>
      </div>
      <nav id="settings-container">
        <div id="settings-menu"><SettingsView /></div>
      </nav>
    </div>
  </div>
</template>

<style lang="css" scoped>

/* iframe style */
.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: inherit;
}

#draggable-btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  user-select: none;
  touch-action: none;
  pointer-events: auto;
}

.drag-bounds {
  position: fixed;
  inset: 0;
}

#settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  /* TODO: get a color from theme as this background */
  background: rgba(0, 0, 0, 0.20);
  backdrop-filter: blur(8px);
  /* compatibility blur: */
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
}

#settings-card {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  width: min(30rem, 90dvw);
  background: #F6F8FB;
  border-radius: 16px;
  padding: 16px;
  pointer-events: auto;
}

#settings-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#title-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.close-btn{
  border: 0;
  background: transparent;
  padding: 0.5rem;
  cursor: pointer;
}
</style>