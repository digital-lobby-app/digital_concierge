<script lang="ts" setup>
  import SettingGroup from './Settings Components/SettingGroup.vue';
  import { IconHomeCog, IconPalette, IconTypography, IconPolaroid } from '@tabler/icons-vue';
  import type { SettingBtnList } from './setting-types';

  const HotelIdentity: SettingBtnList = [{
    icon: IconHomeCog,
    icon_stroke_color:'#35559a',
    icon_bg_color: '#e6ebf5',
    text_heading: 'Name and Info',
    text_body: 'Set the main information of your hotel.'
  }]

  const HotelAppearance: SettingBtnList = [
  {
    icon: IconPalette,
    icon_stroke_color:'#dea15b',
    icon_bg_color: '#fef2e4',
    text_heading: 'Color scheme',
    text_body: 'Choose your portal\'s colors.'
  },
  {
    icon: IconTypography,
    icon_stroke_color: '#564a8d',
    icon_bg_color: '#ece8f7',
    text_heading: 'Typography',
    text_body: 'Set the fonts style for texts.'
  },
  {
    icon: IconPolaroid,
    icon_stroke_color:'#577b65',
    icon_bg_color: '#eaf2ec',
    text_heading: 'Background images',
    text_body: 'Select your desired atmosphere.'
  },
  ]
</script>

<template>
  <div class="setting-group-container">
    <SettingGroup title="HOTEL INFO" :items="HotelIdentity"/>
    <SettingGroup title="APPEARANCE" :items="HotelAppearance"/>
  </div>
</template>

<style lang="css" scoped>
.setting-group-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>