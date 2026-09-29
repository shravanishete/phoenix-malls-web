import { memo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { useNow } from '../hooks/useNow'
import { getMallStatus } from '../logic/getMallStatus'
import type { Mall } from '../types/mall'
import type { MallStatusKind } from '../types/mallStatus'
import { getMarkerIcon } from './markerIcon'

interface MallMarkerProps {
  mall: Mall
  status: MallStatusKind
  selected: boolean
  onSelect: (mall: Mall) => void
}


const MallMarker = memo(function MallMarker({
  mall,
  status,
  selected,
  onSelect,
}: MallMarkerProps) {
  return (
    <Marker
      position={[mall.latitude, mall.longitude]}
      icon={getMarkerIcon(status, selected)}
      zIndexOffset={selected ? 1000 : 0}
      title={mall.name}
      eventHandlers={{ click: () => onSelect(mall) }}
    >
      <Tooltip direction="top" offset={[0, -12]}>
        {mall.name}
      </Tooltip>
    </Marker>
  )
})

interface Props {
  malls: Mall[]
  selectedMallId: string | null
  onSelect: (mall: Mall) => void
}

export default function MallMarkers({ malls, selectedMallId, onSelect }: Props) {
  const now = useNow()

  return (
    <>
      {malls.map((mall) => (
        <MallMarker
          key={mall.id}
          mall={mall}
          status={getMallStatus(mall, now).status}
          selected={mall.id === selectedMallId}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}