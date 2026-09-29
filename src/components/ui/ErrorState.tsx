import { AlertCircle } from 'lucide-react'

interface Props {
  message: string
  onRetry: () => void
}

const RETRY_BUTTON = [
  'mt-2 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white',
  'hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500',
  'focus:ring-offset-2',
].join(' ')

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div role="alert" className="text-sm">
      <p className="flex items-start gap-2 text-red-700">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        {message}
      </p>
      <button onClick={onRetry} className={RETRY_BUTTON}>
        Try again
      </button>
    </div>
  )
}