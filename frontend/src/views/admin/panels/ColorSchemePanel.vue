<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useThemeStore, type ThemeId } from '@/stores/themeStore';
  import type { ColorSchemeBtn }  from '../setting-types';
  import { IconChevronRightFilled } from '@tabler/icons-vue';

  const themeStore = useThemeStore()
  const { currentTheme } = storeToRefs(themeStore)

  function updateTheme(theme: ThemeId) {
    themeStore.setTheme(theme)
  }

  const ThemeOptions: ColorSchemeBtn[] = [
    {
      theme_id: "ocean",
      color_palette: { primary: "#1F3A56", secondary: "#5C7FA6", accent: "#E8B65B" },
      text_heading: "Ocean Calm",
    },
    {
      theme_id: "warm",
      color_palette: { primary: "#7A3E2B", secondary: "#C47A5A", accent: "#F2C14E" },
      text_heading: "Warm Boutique",
    },
    {
      theme_id: "nature",
      color_palette: { primary: "#2F5D50", secondary: "#7FAF9B", accent: "#A8D5BA" },
      text_heading: "Nature Retreat",
    },
    {
      theme_id: "night",
      color_palette: { primary: "#0D1B2A", secondary: "#1B263B", accent: "#E0A458" },
      text_heading: "Night Luxury",
    },
    {
      theme_id: "soft",
      color_palette: { primary: "#6C8EAD", secondary: "#A7C7E7", accent: "#F4A261" },
      text_heading: "Soft Modern",
    },
    {
      theme_id: "obsidian",
      color_palette: { primary: "#7C3AED", secondary: "#1F1B2E", accent: "#22D3EE" },
      text_heading: "Obsidian Dark",
    },
    {
      theme_id: "sunset",
      color_palette: { primary: "#FF5E5B", secondary: "#D72638", accent: "#F4D35E" },
      text_heading: "Sunset Neon",
    },
    {
      theme_id: "forest",
      color_palette: { primary: "#1B4332", secondary: "#2D6A4F", accent: "#95D5B2" },
      text_heading: "Forest Deep",
    },
    {
      theme_id: "royal",
      color_palette: { primary: "#2C2C54", secondary: "#706FD3", accent: "#FFD700" },
      text_heading: "Royal Luxury",
    },
    {
      theme_id: "ice",
      color_palette: { primary: "#3A86FF", secondary: "#A0C4FF", accent: "#CAF0F8" },
      text_heading: "Ice Minimal",
    },
    {
      theme_id: "desert",
      color_palette: { primary: "#BC6C25", secondary: "#DDA15E", accent: "#E9C46A" },
      text_heading: "Desert Modern",
    },
  ];
</script>

<template>
  <div id="theme-container">
    <h3>THEMES</h3>

    <div id="theme-list">
      <button
        v-for="opt in ThemeOptions"
        :key="opt.theme_id"
        class="theme-row"
        @click="updateTheme(opt.theme_id as ThemeId)"
      >
        <span
          class="palette-circle"
          :style="{
            '--primary': opt.color_palette.primary,
            '--secondary': opt.color_palette.secondary,
            '--accent': opt.color_palette.accent,
          }"
          aria-hidden="true"
        />

        <span class="theme-text">{{ opt.text_heading }}</span>

        <IconChevronRightFilled class="theme-chevron" stroke="1.5" />
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
#theme-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-row {
  width: 100%;
  display: flex;
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

.theme-text {
  flex: 1;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
}

.theme-chevron {
  width: 1.25rem;
  height: 1.25rem;
}

.palette-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex: 0 0 auto;

  background:
    linear-gradient(to bottom, var(--secondary) 50%, var(--accent) 50%)
      right / 50% 100% no-repeat,
    linear-gradient(var(--primary), var(--primary))
      left / 50% 100% no-repeat;
}

</style>