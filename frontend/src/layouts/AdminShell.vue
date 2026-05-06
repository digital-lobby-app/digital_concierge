<script setup lang="ts">
import { ref } from 'vue'
import GuestShell from './GuestShell.vue'

const settingsOpen = ref(false)
</script>

<template>
  <div>
    <GuestShell />

    <button @click="settingsOpen = !settingsOpen">Settings</button>
    <!-- Settings panel -->
    <div v-if="settingsOpen">
      <h2>Settings</h2>
      <nav>
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/theme">Theme</RouterLink>
        <RouterLink to="/admin/modules">Modules</RouterLink>
        <RouterLink to="/admin/portal">Guest Portal</RouterLink>
      </nav>
      <RouterView />
    </div>
  </div>
</template>