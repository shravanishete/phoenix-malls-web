import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'

export const WORLD_CENTER: LatLngExpression = [20, 0]
export const WORLD_ZOOM = 2

export const MIN_ZOOM = 2
export const MAX_ZOOM = 18

export const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
]

export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'