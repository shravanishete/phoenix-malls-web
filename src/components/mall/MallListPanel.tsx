import { MapPin } from 'lucide-react'
import type { AsyncState } from '../../hooks/useAsync'
import type { Country } from '../../types/country'
import type { Mall } from '../../types/mall'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

interface Props {
  country: Country
    emptyMessage?: string
  state: AsyncState<Mall[]>
  selectedMallId: string | null
  onSelectMall: (mall: Mall) => void
  onRetry: () => void
}

const PANEL = [
'pointer-events-auto max-h-[50vh] w-[calc(100vw-2rem)] overflow-y-auto',  'rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur md:w-72',
].join(' ')

const ITEM_BUTTON = [
  'flex w-full items-start gap-2 rounded-lg p-2 text-left text-sm',
  'hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500',
].join(' ')

export default function MallListPanel({
  country,
  state,
  selectedMallId,
   emptyMessage,
  onSelectMall,
  onRetry,
}: Props) {
  return (
    <section className={PANEL}>
      <h2 className="text-base font-semibold">Phoenix Malls in {country.name}</h2>

      <div className="mt-3">
        {state.status === 'loading' && <LoadingState message="Loading malls…" />}

        {state.status === 'error' && (
          <ErrorState message={state.error.message} onRetry={onRetry} />
        )}

              {state.status === 'success' && state.data.length === 0 && (
          <EmptyState
            message={emptyMessage ?? `No Phoenix malls in ${country.name} yet.`}
          />
        )}
        {state.status === 'success' && state.data.length > 0 && (
          <ul className="space-y-1">
            {state.data.map((mall) => (
              <li key={mall.id}>
                <button
                  onClick={() => onSelectMall(mall)}
                  aria-current={mall.id === selectedMallId}
                  className={`${ITEM_BUTTON} ${mall.id === selectedMallId ? 'bg-rose-50' : ''}`}
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-rose-600" />
                  <span>
                    <span className="block font-medium">{mall.name}</span>
                    <span className="block text-gray-500">{mall.city}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}