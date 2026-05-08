<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import hotelPin from '@/assets/map-imgs/hotel-pin.png'
import { useHotelStore } from '@/stores/hotel'

const hotel = useHotelStore()

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (
    mapEl.value === null ||
    hotel.latitude === null ||
    hotel.longitude === null ||
    hotel.mapZoom === null
  ) {
    return
  }

  map = L.map(mapEl.value)
  map.setView([hotel.latitude, hotel.longitude], hotel.mapZoom)

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  })
  tiles.addTo(map)

  const hotelIcon = L.divIcon({
    className: 'hotel-pin',
    html: `
      <img src="${hotelPin}" width="40" height="40" alt="" />
      <div class="hotel-pin-label">${hotel.name}</div>
    `,
    iconSize: [40, 56],
    iconAnchor: [20, 40],
  })

  const hotelMarker = L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon })
  hotelMarker.addTo(map)
})

onUnmounted(() => {
  if (map !== null) {
    map.remove()
  }
  map = null
})
</script>

<template>
  <div ref="mapEl" class="map"></div>
</template>

<style lang="css" scoped>
.map {
  height: 100dvh;
  width: 100%;
}

:deep(.hotel-pin) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.hotel-pin-label) {
  margin-top: 2px;
  padding: 2px 6px;
  background: white;
  color: #1F3A56;
  font-size: 0.7rem;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
