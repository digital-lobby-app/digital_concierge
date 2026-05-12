import type { BgImgId } from "@/stores/backgroundImages";
import type { FontPairId } from "@/stores/fontPair";
import type { ThemeId } from "@/stores/themeStore";
import type { Component } from "vue";

export type PanelId = 'root' | 'hotel-info' | 'colors' | 'typography' | 'background'

export type SettingBtn = {
  panelId: PanelId,
  icon: Component,
  icon_tint: 1 | 2 | 3 | 4,
  text_heading: string,
  text_body: string,
}

type ColorPalette = {
  primary: string
  secondary: string
  accent: string
}

export type ColorSchemeBtn = {
  theme_id: ThemeId,
  color_palette: ColorPalette
  text_heading: string
}

export type FontPairBtn = {
  font_pair_id: FontPairId,
  text_heading: string,
  text_body: string,
  text_heading_font_family: string,
  text_body_font_family: string,
}

export type BgImgBtn = {
  bg_img_id: BgImgId,
  bg_img_heading: string,
  bg_img_description: string
}

export type SettingBtnList = SettingBtn[] | ColorSchemeBtn[]