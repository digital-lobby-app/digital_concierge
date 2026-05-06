<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHotelStore } from '@/stores/hotel'

const router = useRouter()
const hotel = useHotelStore()

function goBack() {
  router.push(`/${hotel.slug}/guest-dashboard`)
}
</script>

<template>
  <div>
    <button @click="goBack">← Back</button>
    AboutView content
  </div>
</template>