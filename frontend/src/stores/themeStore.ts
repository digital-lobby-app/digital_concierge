import { defineStore } from 'pinia'

export type ThemeId =
  | 'ocean'
  | 'warm'
  | 'nature'
  | 'night'
  | 'soft'
  | 'obsidian'
  | 'sunset'
  | 'forest'
  | 'royal'
  | 'ice'
  | 'desert'

const STORAGE_KEY = 'theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: (localStorage.getItem(STORAGE_KEY) as ThemeId) ?? 'ocean',
  }),
  actions: {
    setTheme(theme: ThemeId) {
      this.currentTheme = theme
      localStorage.setItem(STORAGE_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    hydrate() {
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    },
  },
})