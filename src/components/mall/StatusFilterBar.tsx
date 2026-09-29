import type { StatusFilter } from '../../logic/filterMallsByStatus'

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open now' },
  { value: 'closed', label: 'Closed' },
]

const BASE = [
  'flex-1 rounded-lg px-3 py-1.5 text-xs font-medium',
  'focus:outline-none focus:ring-2 focus:ring-rose-500',
].join(' ')

interface Props {
  value: StatusFilter
  onChange: (value: StatusFilter) => void
}

export default function StatusFilterBar({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter malls by status"
      className="pointer-events-auto flex w-[calc(100vw-2rem)] gap-1 rounded-2xl bg-white/95 p-1.5 shadow-lg backdrop-blur md:w-72"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`${BASE} ${
            value === option.value
              ? 'bg-rose-600 text-white'
              : 'text-gray-700 hover:bg-rose-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}