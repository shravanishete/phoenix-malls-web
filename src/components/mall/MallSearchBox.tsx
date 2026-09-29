import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useMallSearch } from '../../hooks/useMallSearch'
import type { Mall } from '../../types/mall'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import LoadingState from '../ui/LoadingState'

const MAX_RESULTS = 6

const WRAPPER = [
  'pointer-events-auto w-[calc(100vw-2rem)] rounded-2xl bg-white/95 p-2',
  'shadow-lg backdrop-blur md:w-72',
].join(' ')

const RESULT_BUTTON = [
  'w-full rounded-lg p-2 text-left text-sm hover:bg-rose-50',
  'focus:outline-none focus:ring-2 focus:ring-rose-500',
].join(' ')

export default function MallSearchBox({ onSelect }: { onSelect: (mall: Mall) => void }) {
  const [query, setQuery] = useState('')
  const { state, retry } = useMallSearch(query)
  const active = query.trim().length >= 2

  const choose = (mall: Mall) => {
    setQuery('')
    onSelect(mall)
  }

  return (
    <div className={WRAPPER}>
      <div className="flex items-center gap-2 px-2">
        <Search size={16} className="shrink-0 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
          placeholder="Search malls or cities"
          aria-label="Search malls or cities"
          className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="rounded-full p-1 text-gray-400 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {active && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          {state.status === 'loading' && (
            <div className="px-2 py-1">
              <LoadingState message="Searching…" />
            </div>
          )}
          {state.status === 'error' && (
            <div className="px-2 py-1">
              <ErrorState message={state.error.message} onRetry={retry} />
            </div>
          )}
          {state.status === 'success' && state.data.length === 0 && (
            <div className="px-2 py-1">
              <EmptyState message="No malls match your search." />
            </div>
          )}
          {state.status === 'success' && state.data.length > 0 && (
            <ul>
              {state.data.slice(0, MAX_RESULTS).map((mall) => (
                <li key={mall.id}>
                  <button onClick={() => choose(mall)} className={RESULT_BUTTON}>
                    <span className="block font-medium">{mall.name}</span>
                    <span className="block text-gray-500">
                      {mall.city}, {mall.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}