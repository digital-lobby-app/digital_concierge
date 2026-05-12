<script lang="ts" setup>
  import SettingsButton from './SettingsButton.vue';
  import type { PanelId, SettingBtn } from '../setting-types';

  defineProps<{
    title: string
    items: SettingBtn[]
  }>()

  defineEmits<{ (e: "select", panelId: PanelId): void }>()
</script>

<template>
  <div class="config-container">
    <h3>{{ title }}</h3>

    <div class="config-card">
      <SettingsButton
      v-for="(item,idx) in items"
      :key="item.text_heading"
      class="config-row"
      :class="{'config-row-divider': idx !== items.length -1}"
      v-bind="item"
      @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
  h3 {
    font-size: 0.75rem;
    font-family: var(--font-body);
    font-weight: 400;
    padding-bottom: 0.5rem;
  }

  .config-container {
    display: flex;
    flex-direction: column;
  }

  .config-card {
    border-radius: var(--main-border-radius);
    overflow: hidden;
  }

  .config-row-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>