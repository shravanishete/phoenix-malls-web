import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { WORLD_CENTER, WORLD_ZOOM } from './mapConfig'

interface Target {
  latitude: number
  longitude: number
  zoom: number
}

export default function MapController({ target }: { target: Target | null }) {
  const map = useMap()

  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], target.zoom, { duration: 1.2 })
    } else {
      map.flyTo(WORLD_CENTER, WORLD_ZOOM, { duration: 1.2 })
    }
  }, [map, target])

  return null
}