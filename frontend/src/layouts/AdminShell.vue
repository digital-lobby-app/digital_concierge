<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core';
import SettingsView from '@/views/admin/SettingsView.vue';
import { IconSettings, IconX, IconLogout  } from '@tabler/icons-vue'
import { useHotelStore } from '@/stores/hotel';
import { useFontPairStore } from '@/stores/fontPair';
import { useBgImgStore } from '@/stores/backgroundImages';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/themeStore';
import { adminLogout } from '@/services/auth.service';


const hotel = useHotelStore()
const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
const fontPairStore = useFontPairStore()
const { currentFontPair } = storeToRefs(fontPairStore)
const bgImgStore = useBgImgStore()
const { currentBgImg } = storeToRefs(bgImgStore)

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
  :key="`${currentTheme}-${currentFontPair}-${currentBgImg}`"
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
      <button class="logout-button" v-on:click="adminLogout">
        <IconLogout id="logout-icon" stroke='2' />
        logout</button>
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
  background-color: var(--accent);
  /* background-color: var(--glass-accent); */
  color: var(--primary);
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
  background: var(--bg);
  border-radius: 16px;
  padding: 16px;
  pointer-events: auto;

  display: flex;
  flex-direction: column;
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
  color: var(--text);
}

.logout-button {
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: var(--secondary);
  color: var(--icon-on-primary);
  border-radius: 12px;
  text-decoration: none;
  font-size: 1rem;
  font-family: var(--font-heading);
  font-weight: bold;
  gap: 0.3rem;
}

#logout-icon{
  color: var(--icon-on-primary);
}
</style>