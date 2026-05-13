<script lang="ts" setup>
  import SettingGroup from './Settings Components/SettingGroup.vue';
  import { IconHomeCog, IconPalette, IconTypography, IconPolaroid, IconArrowBackUp } from '@tabler/icons-vue';
  import { ref, type Component } from 'vue';
  import type { SettingBtnList, PanelId } from './setting-types';
  import ColorSchemePanel from './panels/ColorSchemePanel.vue';
  import TypographyPanel from './panels/TypographyPanel.vue';
  import HotelInfoPanel from './panels/HotelInfoPanel.vue';
  import BackgroundPanel from './panels/BackgroundPanel.vue';


  const HotelInfo: SettingBtnList = [{
    panelId: 'hotel-info',
    icon: IconHomeCog,
    icon_tint: 1,
    text_heading: 'Name and Info',
    text_body: 'Set the main information of your hotel.'
  }]

  const HotelAppearance: SettingBtnList = [
  {
    panelId: 'colors',
    icon: IconPalette,
    icon_tint: 2,
    text_heading: 'Color scheme',
    text_body: 'Choose your portal\'s colors.'
  },
  {
    panelId: 'typography',
    icon: IconTypography,
    icon_tint: 3,
    text_heading: 'Typography',
    text_body: 'Set the fonts style for texts.'
  },
  {
    panelId: 'background',
    icon: IconPolaroid,
    icon_tint: 4,
    text_heading: 'Background images',
    text_body: 'Select your desired atmosphere.'
  },
  ]

  const activePanel = ref<PanelId>("root")
  const panels: Record<PanelId, Component | null> = {
  'root': null,
  'hotel-info': HotelInfoPanel,
  'colors': ColorSchemePanel,
  'typography': TypographyPanel,
  'background': BackgroundPanel,
}
</script>

<template>
  <div v-if="activePanel === 'root'" class="setting-group-container">
    <SettingGroup title="HOTEL INFO" :items="HotelInfo" @select="activePanel = $event"/>
    <SettingGroup title="APPEARANCE" :items="HotelAppearance" @select="activePanel = $event"/>
  </div>
  <div v-else class="setting-group-container">
    <component
    :is="panels[activePanel]"
    />
    <button id="back-btn" @click="activePanel = 'root'">
      <IconArrowBackUp stroke='2' />
    </button>
  </div>
</template>

<style lang="css" scoped>
.setting-group-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 85dvh;
  overflow: auto;
  background-color: var(--bg);
}

#back-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--main-border-radius);
  min-height: 3rem;
  background-color: var(--secondary);
  color: var(--icon-on-primary);
}
</style>