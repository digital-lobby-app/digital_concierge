<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHotelStore } from '@/stores/hotel'
import { IconInfoCircle, IconMap2, IconBook, IconToolsKitchen3 } from '@tabler/icons-vue'
import oceanBg from '@/assets/bg-imgs/ocean-bg-imgs/mobile/ocean-bg-m-1.png'

const router = useRouter()
const hotel = useHotelStore()
const iconStroke = "1.5"

function goTo(page: string) {
  router.push(`/${hotel.slug}/${page}`)
}
</script>

<template>
  <div id="main-container" :style="{ backgroundImage: `url(${oceanBg})` }">
    <div id="main-txt">
      <h1 id="main-header">Welcome</h1>
      <p id="main-p">We're here to make your stay exceptional</p>
    </div>
    <div id="dash-btns">
      <button class="dash-btn" @click="goTo('about')">
        <i class="btn-icon"> <IconInfoCircle :stroke="iconStroke" /> </i>
        <p class="btn-txt">About Us</p>
      </button>
      <button class="dash-btn" @click="goTo('map')">
        <i class="btn-icon"><IconMap2 :stroke="iconStroke" /></i>
        <p class="btn-txt">Explore</p>
      </button>
      <button class="dash-btn" @click="goTo('services')">
        <i class="btn-icon"><IconToolsKitchen3 :stroke="iconStroke" /></i>
        <p class="btn-txt">Services</p>
      </button>
      <button class="dash-btn" @click="goTo('requests')">
        <i class="btn-icon"><IconBook :stroke="iconStroke" /></i>
        <p class="btn-txt">Guestbook</p>
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
/* same styles, unchanged */
#main-container {
  height: 100dvh;
  justify-content: end;
  display: flex;
  flex-direction: column;
  background-size: cover;
  padding: 1.5rem;
  gap: 8rem;
}

#main-txt {
  color: #1F3A56;
}

#main-header {
  font-size: 3rem;
}

#main-p {
  font-size: 1.2rem;
}

#dash-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.dash-btn {
  height: 9em;
  border-radius: var(--main-border-radius);
  border: none;
  color: #1F3A56;
  background-color: #F6F8FB;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.btn-icon svg {
  height: 2.5rem;
  width: 2.5rem;
}
/* TODO: remove hard-coded fonts/theme colors */
h1 {
  font-family: "Playfair Display", serif;
}

p {
  font-family: "Inter", sans-serif;
}
</style>