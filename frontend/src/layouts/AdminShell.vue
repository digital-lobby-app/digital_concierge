<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core';
import GuestDashboardView from '@/views/guest/GuestDashboardView.vue'
import SettingsView from '@/views/admin/SettingsView.vue';
import { IconSettings } from '@tabler/icons-vue'

const settingsOpen = ref(false)
const el = ref<HTMLElement | null>(null)
const screenBounds = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, {
  containerElement: screenBounds,
  initialValue: {x: 280, y: 40 },
  preventDefault: true,
  stopPropagation: true,
})
</script>

<template>
  <div ref="screenBounds" class="drag-bounds">
    <GuestDashboardView />

    <button
      id="draggable-btn"
      ref="el"
      :style="style"
      @click="settingsOpen = !settingsOpen; console.log('clicked', settingsOpen)">
      <IconSettings stroke="1.5" />
    </button>

    <!-- Settings panel -->
    <div v-if="settingsOpen" id="settings-overlay" aria-hidden="true"></div>
    <div v-if="settingsOpen"  id="settings-card">
      <h2>Settings</h2>
      <nav id="settings-container">
        <div id="settings-menu"><SettingsView /></div>
        <!-- <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/theme">Theme</RouterLink>
        <RouterLink to="/admin/modules">Modules</RouterLink>
        <RouterLink to="/admin/portal">Guest Portal</RouterLink> -->
      </nav>
      <!-- Do we need this RouterView? -->
      <!-- <RouterView /> -->
    </div>
  </div>
</template>

<style lang="css" scoped>

#draggable-btn {
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
  pointer-events: none;
}

#settings-overlay {
  position: fixed;
  inset: 0;
  /* z-index: 9998; might be needed in the future*/
  /* TODO: get a color from theme as this background */
  background: rgba(0, 0, 0, 0.20);
  backdrop-filter: blur(8px);
  /* compatibility blur: */
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
}

#settings-card {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  width: min(30rem, 90dvw);
  background: white;
  border-radius: 16px;
  padding: 16px;
}

#settings-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

</style>