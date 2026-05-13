import type { PoiCategory } from '@/services/hotel.service';

export const categoryOrder: PoiCategory[] = ['restaurant', 'sports', 'attraction', 'shopping'];

export const categoryConfig: Record<PoiCategory, { color: string; label: string; svgPaths: string }> = {
  restaurant: {
    color: '#E07A5F',
    label: 'Restaurants & Cafés',
    svgPaths: '<path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />',
  },
  sports: {
    color: '#4A90E2',
    label: 'Sports',
    svgPaths: '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z" /><path d="M12 7v-4m3.5 13.5l3.5 1m-11 -1l-3.5 1m1.74 -9l-2.74 -2m15.5 2l2.74 -2" />',
  },
  attraction: {
    color: '#81B29A',
    label: 'Attractions',
    svgPaths: '<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />',
  },
  shopping: {
    color: '#5E2D8C',
    label: 'Shopping',
    svgPaths: '<path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.844a3 3 0 0 1 -2.966 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" /><path d="M9 11v-5a3 3 0 0 1 6 0v5" />',
  },
};

export function categoryIconSvg(category: PoiCategory, size: number, strokeColor: string): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${categoryConfig[category].svgPaths}</svg>`;
}
