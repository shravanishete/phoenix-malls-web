import { Inbox } from 'lucide-react'

export default function EmptyState({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 text-sm text-gray-500">
      <Inbox size={16} className="mt-0.5 shrink-0" />
      {message}
    </p>
  )
}