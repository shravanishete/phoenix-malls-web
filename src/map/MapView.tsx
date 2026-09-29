import type { ReactNode } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import {
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_ATTRIBUTION,
  TILE_URL,
  WORLD_BOUNDS,
  WORLD_CENTER,
  WORLD_ZOOM,
} from './mapConfig'

export default function MapView({ children }: { children?: ReactNode }) {
  return (
    <MapContainer
      center={WORLD_CENTER}
      zoom={WORLD_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1}
      worldCopyJump
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ZoomControl position="topright" />
      {children}
    </MapContainer>
  )
}