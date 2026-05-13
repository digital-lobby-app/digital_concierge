<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useHotelStore } from '@/stores/hotel';
import { useAuthStore } from '@/stores/auth';
import { adminAuth } from '@/services/auth.service';
import { createPoi, deletePoi, createReview, deleteReview, fetchSlugById } from '@/services/hotel.service';
import type { Poi, PoiCategory, Review } from '@/services/hotel.service';

import MapFilterChips from '@/components/map/MapFilterChips.vue';
import AddPoiModal from '@/components/map/AddPoiModal.vue';
import AddReviewModal from '@/components/map/AddReviewModal.vue';
import { categoryConfig, categoryIconSvg } from '@/components/map/categoryConfig';

const hotel = useHotelStore();
const auth = useAuthStore();

const mapEl = ref<HTMLDivElement | null>(null);

let map: L.Map | null = null;
const markersById = new Map<string, L.Marker>();
let placingPin: L.Marker | null = null;
let pendingLatLng: L.LatLng | null = null;
let resizeObserver: ResizeObserver | null = null;

// Per-POI expansion state for the "More reviews" toggle in popups.
// Not reactive; popups are rebuilt on close+open via the bindPopup callback.
const expandedPoiIds = new Set<string>();

const selectedCategories = ref<Set<PoiCategory>>(
  new Set<PoiCategory>(['restaurant', 'sports', 'attraction', 'shopping'])
);
const mode = ref<'view' | 'placing'>('view');
const showModal = ref(false);

const showReviewModal = ref(false);
const reviewModalPoiId = ref<string | null>(null);
const reviewModalPoiName = ref<string>('');

const userHotelSlug = ref<string | null>(null);

const isHotelAdmin = computed(() => {
  return auth.isAuthenticated
    && auth.user !== null
    && userHotelSlug.value !== null
    && hotel.slug !== undefined
    && userHotelSlug.value === hotel.slug;
});

async function hydrateAdminContext() {
  if (!auth.isAuthenticated || auth.isExpired) {
    userHotelSlug.value = null;
    return;
  }
  try {
    let userId: string;
    if (auth.user !== null) {
      userId = auth.user.id;
    } else {
      const { user } = await adminAuth();
      auth.setUser(user);
      userId = user.id;
    }
    userHotelSlug.value = await fetchSlugById(userId);
  } catch {
    // Token was present but the server rejected it — clear so we don't keep retrying.
    auth.logout();
    userHotelSlug.value = null;
  }
}

function buildPoiIconHtml(poi: Poi): string {
  const cfg = categoryConfig[poi.category];
  const isAdmin = poi.source === 'admin';
  const fill = isAdmin ? cfg.color : 'white';
  const stroke = cfg.color;
  const iconStroke = isAdmin ? 'white' : cfg.color;
  const star = isAdmin ? '<span class="poi-pin-star">★</span>' : '';
  return `
    <div class="poi-pin poi-pin--${poi.source}">
      <svg class="poi-pin-disc" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="${fill}" stroke="${stroke}" stroke-width="3" />
        <g transform="translate(8 8)">${categoryIconSvg(poi.category, 20, iconStroke)}</g>
      </svg>
      ${star}
    </div>
  `;
}

function buildReviewRowHtml(poiId: string, review: Review): string {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const dateStamp = review.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const byline = review.reviewerName !== null && review.reviewerName.length > 0
    ? `${escapeHtml(review.reviewerName)}, ${dateStamp}`
    : dateStamp;
  const deleteIcon = isHotelAdmin.value
    ? `<button class="poi-popup-review-delete" data-poi-id="${poiId}" data-review-id="${review.id}" type="button" aria-label="Delete review">×</button>`
    : '';
  return `
    <div class="poi-popup-review">
      <div class="poi-popup-review-meta">
        <span class="poi-popup-review-stars">${stars}</span>
        <span class="poi-popup-review-date">${byline}</span>
        ${deleteIcon}
      </div>
      <div class="poi-popup-review-comment">${escapeHtml(review.comment)}</div>
    </div>
  `;
}

function buildPoiPopupHtml(poi: Poi): string {
  const cfg = categoryConfig[poi.category];
  const slugDisplay = (hotel.slug ?? '').toUpperCase();
  const sourceTag = poi.source === 'admin'
    ? `<span class="poi-popup-tag poi-popup-tag--admin">Recommended by ${escapeHtml(slugDisplay)}</span>`
    : '<span class="poi-popup-tag poi-popup-tag--guest">Guest recommendation</span>';

  const noteLine = poi.comment !== null && poi.source === 'admin'
    ? `<div class="poi-popup-note">${escapeHtml(poi.comment)}</div>`
    : '';

  const sortedReviews = [...poi.reviews].sort((a, b) =>
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  const reviewCount = sortedReviews.length;
  const isExpanded = expandedPoiIds.has(poi.id);
  const reviewsToShow = isExpanded ? sortedReviews : sortedReviews.slice(0, 1);
  const reviewsHtml = reviewsToShow.map((r) => buildReviewRowHtml(poi.id, r)).join('');

  const reviewsSection = reviewCount > 0
    ? `<div class="poi-popup-reviews-label">Reviews (${reviewCount})</div>
       <div class="${isExpanded ? 'poi-popup-reviews-expanded' : ''}">${reviewsHtml}</div>`
    : '<div class="poi-popup-reviews-label">No reviews yet</div>';

  const moreReviewsBtn = reviewCount > 1
    ? `<button class="poi-popup-more-reviews" data-poi-id="${poi.id}" type="button">${isExpanded ? 'Show less' : `More reviews (${reviewCount - 1})`}</button>`
    : '';

  const addReviewBtn = `<button class="poi-popup-add-review" data-poi-id="${poi.id}" type="button">Add a review</button>`;

  const deleteBtn = isHotelAdmin.value
    ? `<button class="poi-popup-delete" data-poi-id="${poi.id}" type="button">Delete POI</button>`
    : '';

  return `
    <div class="poi-popup">
      <div class="poi-popup-header">
        <span class="poi-popup-cat-dot" style="background:${cfg.color}"></span>
        <div class="poi-popup-title">${escapeHtml(poi.name)}</div>
      </div>
      <div class="poi-popup-category">${cfg.label}</div>
      ${sourceTag}
      ${noteLine}
      <div class="poi-popup-reviews-section">
        ${reviewsSection}
      </div>
      ${moreReviewsBtn}
      ${addReviewBtn}
      ${deleteBtn}
    </div>
  `;
}

function buildHotelPopupHtml(): string {
  return `<div class="poi-popup"><div class="poi-popup-title">${escapeHtml(hotel.name)}</div><div class="poi-popup-category">Your hotel</div></div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wirePopupButtons(popupEl: HTMLElement, poi: Poi) {
  const deleteBtn = popupEl.querySelector('.poi-popup-delete') as HTMLButtonElement | null;
  if (deleteBtn !== null) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onDeletePoi(poi.id);
    });
  }

  const addReviewBtn = popupEl.querySelector('.poi-popup-add-review') as HTMLButtonElement | null;
  if (addReviewBtn !== null) {
    addReviewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onAddReviewClick(poi.id);
    });
  }

  const moreReviewsBtn = popupEl.querySelector('.poi-popup-more-reviews') as HTMLButtonElement | null;
  if (moreReviewsBtn !== null) {
    moreReviewsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      onToggleMoreReviews(poi.id);
    });
  }

  const reviewDeleteBtns = popupEl.querySelectorAll('.poi-popup-review-delete');
  reviewDeleteBtns.forEach((btn) => {
    const reviewId = (btn as HTMLElement).dataset.reviewId;
    if (reviewId !== undefined) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onReviewDelete(poi.id, reviewId);
      });
    }
  });
}

function refreshPopupForPoi(poiId: string) {
  const marker = markersById.get(poiId);
  if (marker === undefined) return;
  const poi = hotel.pois.find((p) => p.id === poiId);
  if (poi === undefined) return;
  const popup = marker.getPopup();
  if (popup === undefined || popup === null) return;

  popup.setContent(buildPoiPopupHtml(poi));

  if (marker.isPopupOpen()) {
    // setContent replaced the DOM — re-attach button handlers
    const popupEl = popup.getElement();
    if (popupEl !== undefined && popupEl !== null) {
      wirePopupButtons(popupEl, poi);
    }
  } else {
    // Popup was closed; openPopup will fire popupopen and the original handler wires buttons
    marker.openPopup();
  }
}

function createPoiMarker(poi: Poi): L.Marker {
  const icon = L.divIcon({
    className: 'poi-pin-wrap',
    html: buildPoiIconHtml(poi),
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
  const marker = L.marker([poi.latitude, poi.longitude], { icon });
  marker.bindPopup(() => buildPoiPopupHtml(poi));
  marker.on('popupopen', (e) => {
    const popupEl = (e as L.PopupEvent).popup.getElement();
    if (popupEl === null || popupEl === undefined) return;
    wirePopupButtons(popupEl, poi);
  });
  applyFilterToMarker(marker, poi.category);
  return marker;
}

function applyFilterToMarker(marker: L.Marker, category: PoiCategory) {
  const isOn = selectedCategories.value.has(category);
  const el = marker.getElement();
  if (el !== null && el !== undefined) {
    el.style.display = isOn ? '' : 'none';
  }
}

function toggleCategory(cat: PoiCategory) {
  const next = new Set(selectedCategories.value);
  if (next.has(cat)) {
    next.delete(cat);
  } else {
    next.add(cat);
  }
  selectedCategories.value = next;
  for (const poi of hotel.pois) {
    const marker = markersById.get(poi.id);
    if (marker !== undefined) {
      applyFilterToMarker(marker, poi.category);
    }
  }
}

function onMapContextmenu(e: L.LeafletMouseEvent) {
  if (e.originalEvent !== undefined && e.originalEvent !== null) {
    e.originalEvent.preventDefault();
  }
  if (mode.value !== 'view') return;
  enterPlaceMode(e.latlng);
}

function preventNativeContextMenu(e: Event) {
  e.preventDefault();
}

function enterPlaceMode(latlng: L.LatLng) {
  if (map === null) return;
  mode.value = 'placing';
  pendingLatLng = latlng;
  map.dragging.disable();

  const placingPinHtml = `
    <svg width="44" height="56" viewBox="0 0 44 56">
      <path d="M22 0C9.85 0 0 9.85 0 22c0 13 22 34 22 34s22-21 22-34C44 9.85 34.15 0 22 0z" fill="rgba(0,0,0,0.55)" stroke="white" stroke-width="2.5"/>
      <circle cx="22" cy="22" r="6" fill="white"/>
    </svg>
  `;
  placingPin = L.marker([latlng.lat, latlng.lng], {
    icon: L.divIcon({
      className: 'placing-pin-wrap',
      html: placingPinHtml,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
    }),
    interactive: false,
    keyboard: false,
  });
  placingPin.addTo(map);
  showModal.value = true;
}

function exitPlaceMode() {
  if (placingPin !== null && map !== null) {
    placingPin.remove();
    placingPin = null;
  }
  if (map !== null) {
    map.dragging.enable();
  }
  pendingLatLng = null;
  mode.value = 'view';
}

function onModalClose() {
  showModal.value = false;
  exitPlaceMode();
}

async function onModalSubmit(payload: { category: PoiCategory; name: string; rating?: number; comment?: string; reviewerName?: string }) {
  if (hotel.slug === undefined || pendingLatLng === null) return;
  const adminUserId = isHotelAdmin.value && auth.user !== null ? auth.user.id : undefined;
  try {
    const newPoi = await createPoi(
      hotel.slug,
      {
        category: payload.category,
        latitude: pendingLatLng.lat,
        longitude: pendingLatLng.lng,
        name: payload.name,
        rating: payload.rating,
        comment: payload.comment,
        reviewerName: payload.reviewerName,
      },
      adminUserId
    );
    hotel.pois.push(newPoi);
    showModal.value = false;
    exitPlaceMode();
  } catch (err) {
    console.error('createPoi failed:', err);
  }
}

async function onDeletePoi(poiId: string) {
  if (hotel.slug === undefined || auth.user === null) return;
  if (!confirm('Delete this place?')) return;
  try {
    await deletePoi(hotel.slug, poiId, auth.user.id);
    const idx = hotel.pois.findIndex((p) => p.id === poiId);
    if (idx !== -1) hotel.pois.splice(idx, 1);
    expandedPoiIds.delete(poiId);
  } catch (err) {
    console.error('deletePoi failed:', err);
  }
}

function onAddReviewClick(poiId: string) {
  const poi = hotel.pois.find((p) => p.id === poiId);
  reviewModalPoiId.value = poiId;
  reviewModalPoiName.value = poi?.name ?? '';
  showReviewModal.value = true;
}

function onReviewModalClose() {
  showReviewModal.value = false;
  reviewModalPoiId.value = null;
  reviewModalPoiName.value = '';
}

async function onReviewSubmit(payload: { rating: number; comment: string; reviewerName?: string }) {
  if (hotel.slug === undefined || reviewModalPoiId.value === null) return;
  const poiId = reviewModalPoiId.value;
  try {
    const newReview = await createReview(hotel.slug, poiId, payload);
    const poi = hotel.pois.find((p) => p.id === poiId);
    if (poi !== undefined) {
      poi.reviews.push(newReview);
    }
    refreshPopupForPoi(poiId);
    showReviewModal.value = false;
    reviewModalPoiId.value = null;
    reviewModalPoiName.value = '';
  } catch (err) {
    console.error('createReview failed:', err);
  }
}

async function onReviewDelete(poiId: string, reviewId: string) {
  if (hotel.slug === undefined || auth.user === null) return;
  if (!confirm('Delete this review?')) return;
  try {
    await deleteReview(hotel.slug, poiId, reviewId, auth.user.id);
    const poi = hotel.pois.find((p) => p.id === poiId);
    if (poi !== undefined) {
      poi.reviews = poi.reviews.filter((r) => r.id !== reviewId);
    }
    refreshPopupForPoi(poiId);
  } catch (err) {
    console.error('deleteReview failed:', err);
  }
}

function onToggleMoreReviews(poiId: string) {
  if (expandedPoiIds.has(poiId)) {
    expandedPoiIds.delete(poiId);
  } else {
    expandedPoiIds.add(poiId);
  }
  refreshPopupForPoi(poiId);
}

watch(
  () => hotel.pois,
  (newPois) => {
    if (map === null) return;
    const currentIds = new Set(newPois.map((p) => p.id));
    for (const [id, marker] of markersById.entries()) {
      if (!currentIds.has(id)) {
        marker.remove();
        markersById.delete(id);
      }
    }
    for (const poi of newPois) {
      if (!markersById.has(poi.id)) {
        const marker = createPoiMarker(poi);
        marker.addTo(map);
        markersById.set(poi.id, marker);
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  hydrateAdminContext();

  if (
    mapEl.value === null
    || hotel.latitude === null
    || hotel.longitude === null
    || hotel.mapZoom === null
  ) {
    return;
  }

  map = L.map(mapEl.value);
  map.setView([hotel.latitude, hotel.longitude], hotel.mapZoom);

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    maxNativeZoom: 19,
  });
  tiles.addTo(map);

  resizeObserver = new ResizeObserver(() => {
    if (map !== null) map.invalidateSize();
  });
  resizeObserver.observe(mapEl.value);

  const hotelIcon = L.divIcon({
    className: 'hotel-pin',
    html: `
      <svg class="hotel-pin-pin" width="44" height="56" viewBox="0 0 44 56">
        <path d="M22 0C9.85 0 0 9.85 0 22c0 13 22 34 22 34s22-21 22-34C44 9.85 34.15 0 22 0z" fill="#E63946" stroke="white" stroke-width="2.5"/>
        <svg x="12" y="11" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
      </svg>
      <div class="hotel-pin-label">${escapeHtml(hotel.name)}</div>
    `,
    iconSize: [44, 72],
    iconAnchor: [22, 56],
  });

  const hotelMarker = L.marker([hotel.latitude, hotel.longitude], { icon: hotelIcon });
  hotelMarker.bindPopup(() => buildHotelPopupHtml());
  hotelMarker.addTo(map);

  for (const poi of hotel.pois) {
    const marker = createPoiMarker(poi);
    marker.addTo(map);
    markersById.set(poi.id, marker);
  }

  map.on('contextmenu', onMapContextmenu);
  map.getContainer().addEventListener('contextmenu', preventNativeContextMenu);
});

onUnmounted(() => {
  if (resizeObserver !== null) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map !== null) {
    map.getContainer().removeEventListener('contextmenu', preventNativeContextMenu);
    map.off('contextmenu', onMapContextmenu);
    map.remove();
  }
  map = null;
  markersById.clear();
  placingPin = null;
  pendingLatLng = null;
  expandedPoiIds.clear();
});
</script>

<template>
  <div class="map-shell">
    <div ref="mapEl" class="map"></div>

    <div class="filter-bar">
      <MapFilterChips :selected="selectedCategories" @toggle="toggleCategory" />
    </div>

    <div v-show="mode === 'view'" class="press-hint">
      Right-click (desktop) or long-press (mobile) the map to {{ isHotelAdmin ? 'add' : 'recommend' }} a place
    </div>

    <AddPoiModal
      :open="showModal"
      :is-admin="isHotelAdmin"
      @close="onModalClose"
      @submit="onModalSubmit"
    />

    <AddReviewModal
      :open="showReviewModal"
      :poi-name="reviewModalPoiName"
      @close="onReviewModalClose"
      @submit="onReviewSubmit"
    />
  </div>
</template>

<style lang="css" scoped>
.map-shell {
  position: relative;
  height: 100%;
  width: 100%;
  overscroll-behavior: contain;
}

.map {
  height: 100%;
  width: 100%;
}

.filter-bar {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
}

.press-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  padding: 0.5rem 1rem;
  background: var(--surface);
  color: var(--text);
  border-radius: 99rem;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  opacity: 0.92;
  white-space: nowrap;
}

:deep(.hotel-pin) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.hotel-pin-pin) {
  display: block;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}

:deep(.hotel-pin-label) {
  margin-top: 2px;
  padding: 2px 6px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.7rem;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.poi-pin-wrap) {
  background: transparent;
  border: none;
}

:deep(.poi-pin) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.poi-pin-disc) {
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
}

:deep(.poi-pin-star) {
  position: absolute;
  top: -4px;
  right: -4px;
  background: white;
  color: #f5b041;
  font-size: 11px;
  width: 16px;
  height: 16px;
  border-radius: 99rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

:deep(.placing-pin-wrap) {
  background: transparent;
  border: none;
}

:deep(.placing-pin-wrap svg) {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
}

:deep(.poi-popup) {
  font-family: inherit;
  color: var(--text);
  min-width: 220px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

:deep(.poi-popup-header) {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

:deep(.poi-popup-cat-dot) {
  width: 10px;
  height: 10px;
  border-radius: 99rem;
  display: inline-block;
}

:deep(.poi-popup-title) {
  font-weight: 600;
  font-size: 0.95rem;
}

:deep(.poi-popup-category) {
  font-size: 0.75rem;
  opacity: 0.7;
}

:deep(.poi-popup-tag) {
  align-self: flex-start;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 99rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.poi-popup-tag--admin) {
  background: color-mix(in srgb, var(--primary) 20%, transparent);
  color: var(--primary);
}

:deep(.poi-popup-tag--guest) {
  background: color-mix(in srgb, var(--text) 12%, transparent);
  color: var(--text);
}

:deep(.poi-popup-note) {
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.85;
}

:deep(.poi-popup-reviews-section) {
  margin-top: 0.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

:deep(.poi-popup-reviews-label) {
  font-size: 0.65rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-top: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
  padding-top: 0.3rem;
}

:deep(.poi-popup-reviews-expanded) {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.2rem;
}

:deep(.poi-popup-review) {
  padding: 0.4rem 0;
  border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
}

:deep(.poi-popup-review:first-child) {
  border-top: none;
}

:deep(.poi-popup-review-meta) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.15rem;
}

:deep(.poi-popup-review-stars) {
  color: #f5b041;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

:deep(.poi-popup-review-date) {
  font-size: 0.65rem;
  opacity: 0.6;
  margin-left: auto;
}

:deep(.poi-popup-review-delete) {
  background: transparent;
  border: none;
  color: var(--text);
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.poi-popup-review-delete:hover) {
  color: #c0392b;
  opacity: 1;
}

:deep(.poi-popup-review-comment) {
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.9;
}

:deep(.poi-popup-more-reviews) {
  align-self: flex-start;
  margin-top: 0.1rem;
  background: transparent;
  color: var(--text);
  border: none;
  padding: 0.15rem 0;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.7;
  text-decoration: underline;
}

:deep(.poi-popup-more-reviews:hover) {
  opacity: 1;
}

:deep(.poi-popup-add-review) {
  align-self: flex-start;
  margin-top: 0.4rem;
  background: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 99rem;
  padding: 0.4rem 0.9rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

:deep(.poi-popup-delete) {
  align-self: flex-start;
  margin-top: 0.3rem;
  background: transparent;
  color: #c0392b;
  border: 1px solid #c0392b;
  border-radius: 99rem;
  padding: 0.3rem 0.8rem;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

:deep(.poi-popup-delete:hover) {
  background: #c0392b;
  color: white;
}
</style>
