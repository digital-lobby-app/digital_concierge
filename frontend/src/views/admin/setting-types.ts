import type { Component } from "vue";

export type SettingBtn = {
  icon: Component,
  icon_stroke_color: string,
  icon_bg_color: string,
  text_heading: string,
  text_body: string,
}

export type SettingBtnList = SettingBtn[]