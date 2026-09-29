import L from 'leaflet'
import type { MallStatusKind } from '../types/mallStatus'

const cache = new Map<string, L.DivIcon>()

export function getMarkerIcon(status: MallStatusKind, selected = false): L.DivIcon {
  const key = `${status}:${selected}`
  let icon = cache.get(key)
  if (!icon) {
    const selectedClass = selected ? ' mall-marker--selected' : ''
    icon = L.divIcon({
      className: 'mall-marker-icon', 
      html: `<span class="mall-marker mall-marker--${status}${selectedClass}">
               <span class="mall-marker__pulse"></span>
               <span class="mall-marker__dot"></span>
             </span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })
    cache.set(key, icon)
  }
  return icon
}