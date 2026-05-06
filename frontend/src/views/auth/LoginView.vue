<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function devLogin() {
  auth.token = 'dev-token'
  router.push({ name: 'admin-dashboard' })
}
</script>

<template>
  <div>
    <p>Login</p>
    <button @click="devLogin">Dev login</button>
  </div>
</template>