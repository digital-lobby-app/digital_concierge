<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function devLogin() {
  auth.token = 'dev-token'
  router.push({ name: 'admin-dashboard' })
}
function guestLogin() {
  router.push('/dev-hotel/guest-dashboard')
}
</script>

<template>
  <div>
    <p>Login</p>
    <button @click="devLogin">Dev login</button>
    <button @click="guestLogin">Guest login</button>
  </div>
</template>