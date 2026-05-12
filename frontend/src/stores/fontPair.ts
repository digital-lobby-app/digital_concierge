import { defineStore } from 'pinia'

export type FontPairId =
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

const STORAGE_KEY = 'font-pair'

export const useFontPairStore = defineStore('font-pair', {
  state: () => ({
    currentFontPair: (localStorage.getItem(STORAGE_KEY) as FontPairId) ?? 'ocean',
  }),
  actions: {
    setFontPair(fontPair: FontPairId) {
      this.currentFontPair = fontPair
      localStorage.setItem(STORAGE_KEY, fontPair)
      document.documentElement.setAttribute('data-font', fontPair)
    },
    hydrate() {
      document.documentElement.setAttribute('data-font', this.currentFontPair)
    },
  },
})