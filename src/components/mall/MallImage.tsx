import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import { getPoolImages } from '../../utils/mallImages'

interface Props {
  src: string
  alt: string
  seed: string
  className?: string
}

export default function MallImage({ src, alt, seed, className = '' }: Props) {
  const sources = [src, ...getPoolImages(seed)].filter(Boolean)
  const [index, setIndex] = useState(0)

  if (index >= sources.length) {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      >
        <ImageOff size={32} />
      </div>
    )
  }

  return (
    <img
      key={sources[index]}
      src={sources[index]}
      alt={alt}
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
      className={`object-cover ${className}`}
    />
  )
}