import L from 'leaflet'
import { Marker } from 'react-leaflet'
import type { Country } from '../types/country'

interface Props {
  countries: Country[]
  onSelect: (country: Country) => void
}

const cache = new Map<string, L.DivIcon>()

const LOGO_SRC = '/images/logo_map1.png'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getCountryIcon(
  name: string,
  side: 'left' | 'right',
): L.DivIcon {
  const key = `${name}:${side}`

  let icon = cache.get(key)

  if (!icon) {
    icon = L.divIcon({
      className: 'country-marker-icon',

      html: `
        <span class="country-marker">
          <span class="country-marker__logo">
            <img
              src="${LOGO_SRC}"
              alt=""
            />
          </span>

          <span class="country-marker__label country-marker__label--${side}">
            ${escapeHtml(name)}
          </span>
        </span>
      `,

      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    cache.set(key, icon)
  }

  return icon
}

export default function CountryMarkers({
  countries,
  onSelect,
}: Props) {
  return (
    <>
      {countries.map((country) => (
        <Marker
          key={country.code}
          position={[country.latitude, country.longitude]}
          icon={getCountryIcon(
            country.name,
            country.labelSide === 'left' ? 'left' : 'right',
          )}
          title={country.name}
          eventHandlers={{
            click: () => onSelect(country),
          }}
        />
      ))}
    </>
  )
}