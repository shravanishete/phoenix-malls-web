import { Clock, Globe, MapPin, Navigation, Phone, X } from 'lucide-react'
import { useEffect } from 'react'
import { useNow } from '../../hooks/useNow'
import { getMallStatus } from '../../logic/getMallStatus'
import type { Mall } from '../../types/mall'
import { formatHoursRange } from '../../utils/format'
import MallImage from './MallImage'
import MallStatusBadge from './MallStatusBadge'

interface Props {
  mall: Mall
  onClose: () => void
}

const ICON = 'mt-0.5 shrink-0 text-rose-600'

const CLOSE_BUTTON = [
  'absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow',
  'hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500',
].join(' ')

const DIRECTIONS_BUTTON = [
  'flex items-center justify-center gap-2 rounded-lg bg-rose-600',
  'px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700',
  'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
].join(' ')

export default function MallDetailsCard({ mall, onClose }: Props) {
  const now = useNow()
  const { status, todayHours, reason } = getMallStatus(mall, now)

  // Esc closes the card (keyboard-friendly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const hoursText = todayHours
    ? formatHoursRange(todayHours.open, todayHours.close)
    : null

  const todayLabel =
    hoursText ??
    (reason === 'closed-today' ? 'Closed today' : 'Hours unavailable')

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mall.latitude},${mall.longitude}`

  return (
    <article
      aria-label={mall.name}
      className="max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
    >
      <div className="relative">
<MallImage src={mall.image} alt={mall.name} seed={mall.id} className="h-44 w-full" />
        <button onClick={onClose} aria-label="Close details" className={CLOSE_BUTTON}>
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <MallStatusBadge status={status} />
          <h2 className="mt-2 text-xl font-semibold text-gray-900">{mall.name}</h2>
          <p className="text-sm text-gray-500">
            {mall.city}, {mall.country}
          </p>
        </div>

        <ul className="space-y-2.5 text-sm text-gray-700">
          <li className="flex gap-2">
            <Clock size={16} className={ICON} />
            <span>
              <span className="font-medium">Today:</span> {todayLabel}
            </span>
          </li>
          <li className="flex gap-2">
            <MapPin size={16} className={ICON} />
            <span>{mall.address}</span>
          </li>
          {mall.phone && (
            <li className="flex gap-2">
              <Phone size={16} className={ICON} />
              <a href={`tel:${mall.phone.replace(/\s/g, '')}`} className="hover:underline">
                {mall.phone}
              </a>
            </li>
          )}
                    {mall.website && (
            <li className="flex gap-2">
              <Globe size={16} className={ICON} />
              <a
                href={mall.website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all hover:underline"
              >
                Visit website
              </a>
            </li>
          )}
                </ul>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={DIRECTIONS_BUTTON}
        >
          <Navigation size={16} /> Get directions
        </a>
      </div>
    </article>
  )
}