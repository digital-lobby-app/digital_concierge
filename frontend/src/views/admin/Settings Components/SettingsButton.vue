<script lang="ts" setup>
import type { Component } from 'vue';
import { IconChevronRightFilled } from '@tabler/icons-vue';
import type { PanelId } from '../setting-types';

defineProps<{
  panelId: PanelId
  icon: Component
  icon_tint: 1 | 2 | 3 | 4
  text_heading: string
  text_body: string
}>()

const emit = defineEmits<{ (e: "select", panelId: PanelId): void }>()

</script>

<template>
    <button class="config-btn" @click="emit('select', panelId)">
      <div id="icon-wrapper" :style="{ backgroundColor: `var(--soft-${icon_tint})`, color: `var(--fixer)` }">
        <component class="btn-icon" :is="icon" :stroke="1.5" />
      </div>
      <div class="config-txt">
        <h4 class="config-txt-header">{{ text_heading }}</h4>
        <p class="config-txt-body">{{ text_body }}</p>
      </div>
      <i class="btn-icon"><IconChevronRightFilled stroke="1.5"/></i>
    </button>
</template>

<style lang="css" scoped>
  .config-btn {
    display: flex;
    padding: var(--main-padding);
    text-align: left;
    gap: 1rem;
    align-items: center;
    font-size: 0.85rem;
    font-family: var(--font-body);
    background-color: var(--surface);
    color: var(--text);
  }

  #icon-wrapper {
    width: 5rem;
    height: fit-content;
    border-radius: var(--main-border-radius);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--main-padding);
  }

  .btn-icon {
    height: 2rem;
    min-width: 2rem;
    color: inherit;
  }

  .config-txt{
    display: flex;
    flex-direction: column;
    gap: 0.5rem
  }
</style>