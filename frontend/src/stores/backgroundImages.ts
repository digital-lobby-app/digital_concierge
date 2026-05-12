import { defineStore} from "pinia";

export type BgImgId =
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

  const STORAGE_KEY = 'bg-img'

  export const useBgImgStore = defineStore('bg-img' ,{
    state: () => ({
      currentBgImg: (localStorage.getItem(STORAGE_KEY) as BgImgId) ?? 'ocean',
    }),
    actions: {
      setBgImg(bgImg: BgImgId) {
        this.currentBgImg = bgImg
        localStorage.setItem(STORAGE_KEY, bgImg)
        document.documentElement.setAttribute('data-bg', bgImg)
      },
      hydrate(){
        document.documentElement.setAttribute('data-bg', this.currentBgImg)
      },
    },
  })