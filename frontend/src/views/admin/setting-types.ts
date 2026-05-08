import type { ThemeId } from "@/stores/themeStore";
import type { Component } from "vue";

export type PanelId = 'root' | 'hotel-info' | 'colors' | 'typography' | 'background'

export type SettingBtn = {
  panelId: PanelId,
  icon: Component,
  icon_stroke_color: string,
  icon_bg_color: string,
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

export type SettingBtnList = SettingBtn[] | ColorSchemeBtn[]