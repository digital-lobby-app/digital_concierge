<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useBgImgStore, type BgImgId } from '@/stores/backgroundImages';
import type { BgImgBtn } from '../setting-types';
import { IconChevronRightFilled, IconCheck } from '@tabler/icons-vue';

const bgImgStore = useBgImgStore()
const { currentBgImg } = storeToRefs(bgImgStore)

function updateBgImg(bgImg: BgImgId) {
  bgImgStore.setBgImg(bgImg)
}

const bgImgOptions: BgImgBtn[] = [
 {
    bg_img_id: "ocean",
    bg_img_heading: "Mediterranean cliffside serenity",
    bg_img_description: "Turquoise horizons, white arches, calm luxury.",
  },
  {
    bg_img_id: "warm",
    bg_img_heading: "Cozy boutique glow",
    bg_img_description: "Terracotta textures, amber lights, welcoming warmth.",
  },
  {
    bg_img_id: "nature",
    bg_img_heading: "Forest eco retreat",
    bg_img_description: "Misty greens, natural wood, restorative calm.",
  },
  {
    bg_img_id: "night",
    bg_img_heading: "Dark premium nights",
    bg_img_description: "Midnight tones, gold glow, sleek luxury.",
  },
  {
    bg_img_id: "soft",
    bg_img_heading: "Friendly modern calm",
    bg_img_description: "Airy blues, soft light, approachable vibe.",
  },
  {
    bg_img_id: "obsidian",
    bg_img_heading: "Arctic aurora luxury",
    bg_img_description: "Violet abyss, cyan glow, Nordic mystery.",
  },
  {
    bg_img_id: "sunset",
    bg_img_heading: "Neon synthwave dream",
    bg_img_description: "Coral skies, neon lights, retro paradise.",
  },
  {
    bg_img_id: "forest",
    bg_img_heading: "Jungle ruins adventure",
    bg_img_description: "Overgrown stone, misty greens, cinematic exploration.",
  },
  {
    bg_img_id: "royal",
    bg_img_heading: "Modern royal elegance",
    bg_img_description: "Navy velvet, gold accents, elite atmosphere.",
  },
  {
    bg_img_id: "ice",
    bg_img_heading: "Minimal arctic calm",
    bg_img_description: "Glacial blues, clean lines, quiet serenity.",
  },
  {
    bg_img_id: "desert",
    bg_img_heading: "Oasis desert tranquility",
    bg_img_description: "Golden dunes, warm light, peaceful retreat.",
  },
];
</script>

<template>
  <div id="theme-container">
    <h3>BACKGROUNDS</h3>

    <div id="bg-list">
      <button
        v-for="opt in bgImgOptions"
        :key="opt.bg_img_id"
        class="bg-row"
        :class="{ selected: opt.bg_img_id === currentBgImg }"
        @click="updateBgImg(opt.bg_img_id as BgImgId)"
      >
        <div class="bg-text">
          <p class="bg-heading">{{ opt.bg_img_heading }}</p>
          <p class="bg-desc">{{ opt.bg_img_description }}</p>
        </div>

        <IconCheck
          v-if="opt.bg_img_id === currentBgImg"
          class="theme-chevron selected"
          stroke="1.5"
        />

        <IconChevronRightFilled
        v-else
        class="theme-chevron" stroke="1.5"
        />
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
#bg-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bg-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;

  padding: 0.9rem 1rem;
  border: 0;
  border-radius: 16px;
  background: var(--surface);
  color: var(--text);
  text-align: left;
  cursor: pointer;
}

.bg-row.selected {
  border: 1px solid var(--secondary);
}

.bg-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.bg-heading {
  font-size: 1rem;
  font-family: var(--font-heading);
}

.bg-desc {
  font-size: 0.9rem;
  opacity: 0.8;
  font-family: var(--font-body);
}

.bg-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-chevron.selected {
  background-color: var(--secondary);
  border-radius: 50%;
  height: 1.45rem;
  width: 1.45rem;
}

</style>