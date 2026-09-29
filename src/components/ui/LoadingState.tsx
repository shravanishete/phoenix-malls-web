import { Loader2 } from 'lucide-react'

export default function LoadingState({ message }: { message: string }) {
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-gray-500">
      <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
      {message}
    </p>
  )
}