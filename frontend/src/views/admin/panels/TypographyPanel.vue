<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useFontPairStore, type FontPairId } from '@/stores/fontPair';
  import type { FontPairBtn }  from '../setting-types';
  import { IconChevronRightFilled, IconCheck } from '@tabler/icons-vue';

  const fontPairStore = useFontPairStore()
  const { currentFontPair } = storeToRefs(fontPairStore)

  function updateFontPair(fontPair: FontPairId) {
    fontPairStore.setFontPair(fontPair)
  }

  const FontPairOptions: FontPairBtn[] = [
  {
    font_pair_id: "ocean",
    text_heading: "Playfair",
    text_body: "Inter",
    text_heading_font_family: "\"Playfair Display\", serif",
    text_body_font_family: "\"Inter\", sans-serif",
  },
  {
    font_pair_id: "warm",
    text_heading: "Cormorant",
    text_body: "Lato",
    text_heading_font_family: "\"Cormorant Garamond\", serif",
    text_body_font_family: "\"Lato\", sans-serif",
  },
  {
    font_pair_id: "nature",
    text_heading: "Lora",
    text_body: "Manrope",
    text_heading_font_family: "\"Lora\", serif",
    text_body_font_family: "\"Manrope\", sans-serif",
  },
  {
    font_pair_id: "night",
    text_heading: "Cinzel",
    text_body: "Work Sans",
    text_heading_font_family: "\"Cinzel\", serif",
    text_body_font_family: "\"Work Sans\", sans-serif",
  },
  {
    font_pair_id: "soft",
    text_heading: "Outfit",
    text_body: "DM Sans",
    text_heading_font_family: "\"Outfit\", sans-serif",
    text_body_font_family: "\"DM Sans\", sans-serif",
  },
  {
    font_pair_id: "obsidian",
    text_heading: "Space",
    text_body: "IBM Plex",
    text_heading_font_family: "\"Space Grotesk\", sans-serif",
    text_body_font_family: "\"IBM Plex Sans\", sans-serif",
  },
  {
    font_pair_id: "sunset",
    text_heading: "DM Serif",
    text_body: "Public",
    text_heading_font_family: "\"DM Serif Display\", serif",
    text_body_font_family: "\"Public Sans\", sans-serif",
  },
  {
    font_pair_id: "forest",
    text_heading: "Merriweather",
    text_body: "Atkinson",
    text_heading_font_family: "\"Merriweather\", serif",
    text_body_font_family: "\"Atkinson Hyperlegible\", sans-serif",
  },
  {
    font_pair_id: "royal",
    text_heading: "Prata",
    text_body: "Libre",
    text_heading_font_family: "\"Prata\", serif",
    text_body_font_family: "\"Libre Franklin\", sans-serif",
  },
  {
    font_pair_id: "ice",
    text_heading: "Sora",
    text_body: "Noto",
    text_heading_font_family: "\"Sora\", sans-serif",
    text_body_font_family: "\"Noto Sans\", sans-serif",
  },
  {
    font_pair_id: "desert",
    text_heading: "Mulish",
    text_body: "Nunito",
    text_heading_font_family: "\"Mulish\", sans-serif",
    text_body_font_family: "\"Nunito Sans\", sans-serif",
  },
];
</script>

<template>
  <div id="theme-container">
    <h3>FONTS</h3>

    <div id="fonts-list">
      <button
        v-for="opt in FontPairOptions"
        :key="opt.font_pair_id"
        class="font-row"
        :class="{ selected: opt.font_pair_id === currentFontPair }"
        @click="updateFontPair(opt.font_pair_id as FontPairId)"
      >
        <div class="font-wrapper">
          <span
          class="fonts-text font-heading"
          :style="{ fontFamily:  opt.text_heading_font_family }"
          >{{ opt.text_heading}}</span>
          <span id="comma">, </span>
          <span
          class="fonts-text font-body"
          :style="{ fontFamily: opt.text_body_font_family }"
          >{{ opt.text_body}}</span>
        </div>

        <IconCheck
          v-if="opt.font_pair_id === currentFontPair"
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
#fonts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.font-row {
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

.font-row.selected {
  border: 1px solid var(--secondary);
}

.fonts-text {
  flex: 1;
  font-size: 1.1rem;
}

.theme-chevron {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-chevron.selected {
  background-color: var(--secondary);
  border-radius: 50%;
  height: 1.45rem;
  width: 1.45rem;;
}

#comma {
  font-family: 'Times New Roman', Times, serif
}
</style>
