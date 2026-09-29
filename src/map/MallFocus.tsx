import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { Mall } from '../types/mall'

const FOCUS_ZOOM = 13
const MOBILE_BREAKPOINT = 768

export default function MallFocus({ mall }: { mall: Mall | null }) {
  const map = useMap()

  useEffect(() => {
    if (!mall) return

    const zoom = Math.max(map.getZoom(), FOCUS_ZOOM)
    const point = map.project([mall.latitude, mall.longitude], zoom)

    
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const target = isMobile ? point.add([0, map.getSize().y * 0.2]) : point

    map.flyTo(map.unproject(target, zoom), zoom, { duration: 0.8 })
  }, [map, mall])

  return null
}