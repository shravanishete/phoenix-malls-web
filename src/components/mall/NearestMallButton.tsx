import { Crosshair, Loader2 } from 'lucide-react'
import { useNearestMall } from '../../hooks/useNearestMall'
import type { Mall } from '../../types/mall'

const BUTTON = [
  'pointer-events-auto flex w-[calc(100vw-2rem)] items-center justify-center gap-2',
  'rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg',
  'hover:bg-rose-700 disabled:opacity-70 md:w-72',
  'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
].join(' ')

const NOTE = [
  'pointer-events-auto w-[calc(100vw-2rem)] rounded-xl bg-white/95 px-3 py-2',
  'text-xs shadow-lg backdrop-blur md:w-72',
].join(' ')

export default function NearestMallButton({ onFound }: { onFound: (mall: Mall) => void }) {
  const { state, find } = useNearestMall()
  const locating = state.status === 'locating'

  const handleClick = async () => {
    const result = await find()
    if (result) onFound(result.mall)
  }

  return (
    <>
      <button onClick={handleClick} disabled={locating} className={BUTTON}>
        {locating ? (
          <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
        ) : (
          <Crosshair size={16} />
        )}
        {locating ? 'Finding your location…' : 'Nearest mall to me'}
      </button>

      {state.status === 'error' && (
        <p role="alert" className={`${NOTE} text-red-700`}>
          {state.message}
        </p>
      )}
      {state.status === 'found' && (
        <p role="status" className={`${NOTE} text-gray-700`}>
          {state.result.mall.name} is about{' '}
          <span className="font-semibold">{Math.round(state.result.distanceKm)} km</span> away
          (straight line).
        </p>
      )}
    </>
  )
}