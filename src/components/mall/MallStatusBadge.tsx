import type { MallStatusKind } from '../../types/mallStatus'

const STYLES: Record<MallStatusKind, { label: string; classes: string; dot: string }> = {
  open: { label: 'OPEN', classes: 'bg-green-100 text-green-800', dot: 'bg-green-600' },
  closed: { label: 'CLOSED', classes: 'bg-red-100 text-red-800', dot: 'bg-red-600' },
  unavailable: { label: 'HOURS UNAVAILABLE', classes: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
}

export default function MallStatusBadge({ status }: { status: MallStatusKind }) {
  const s = STYLES[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.classes}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}