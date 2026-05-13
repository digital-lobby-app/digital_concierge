<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHotelStore } from '@/stores/hotel'
import { IconInfoCircle, IconMap2, IconBook, IconMessageChatbot } from '@tabler/icons-vue'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBgImgStore } from '@/stores/backgroundImages'
import gsap from 'gsap'

const router = useRouter()
const hotel = useHotelStore()
const iconStroke = "1.5"
const bgStore = useBgImgStore()
const { currentBgImg } = storeToRefs(bgStore)

function setImgUrl(set: string, n: number) {
  return new URL (
    `../../assets/bg-imgs/${set}-bg-imgs/mobile/${set}-bg-${n}.png`,
    import.meta.url
  ).href
}

const pickedBgUrl = ref('')

function repickBgUrl(){
  const bgImgOptions = [1, 2, 3, 4, 5].map((n) => setImgUrl(currentBgImg.value, n))
  pickedBgUrl.value = bgImgOptions[Math.floor(Math.random() * bgImgOptions.length)]
}

watch(currentBgImg, repickBgUrl, { immediate: true })

function goTo(page: string) {
  router.push(`/${hotel.slug}/${page}`)
}


//gsap
function onEnter() {
  const tl = gsap.timeline()

  tl.fromTo('.text-anim',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.14 }
  )
  .fromTo('.dash-btn',
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      stagger: 0.14,
    },
    '-=0.7'
  )
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" appear>
  <div id="main-container" :style="{ backgroundImage: `url(${pickedBgUrl})` }">
    <div id="main-txt">
      <h1 class="main-header text-anim">Welcome</h1>
      <p class="main-p text-anim">We're here to make your stay exceptional</p>
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
        <i class="btn-icon"><IconMessageChatbot :stroke="iconStroke" /></i>
        <p class="btn-txt">Services</p>
      </button>
      <button class="dash-btn" @click="goTo('requests')">
        <i class="btn-icon"><IconBook :stroke="iconStroke" /></i>
        <p class="btn-txt">Guestbook</p>
      </button>
    </div>
  </div>
  </Transition>
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
  color: var(--primary);
}

.main-header {
  font-size: 3rem;
}

.main-p {
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
  color: var(--fixer);
  background-color: var(--bg);
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

h1 {
  font-family: var(--font-heading);
}

p {
  font-family: var(--font-body);
}
</style>