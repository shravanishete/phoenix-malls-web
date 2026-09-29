
import { useState } from 'react'

const LOGO_SRC = '/images/logo.png'

// const HEADER = [
//   'pointer-events-auto flex w-fit items-center gap-3 md:w-80',
//   'rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur',
// ].join(' ')

export default function AppHeader() {
  const [, setLogoFailed] = useState(false)

  return (
   <header className="pointer-events-auto flex w-fit items-center gap-3 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur md:w-80">

  <img
    src={LOGO_SRC}
    alt="Phoenix Marketcity"
    onError={() => setLogoFailed(true)}
    className="h-12 w-auto max-w-[10rem] shrink-0 object-contain"
  />

 
  <div className="shrink-0 border-l border-gray-200 pl-3">
    <h1 className="whitespace-nowrap text-lg font-bold leading-tight text-gray-900">
      Global Malls
    </h1>

    <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">
      Live status map
    </p>
  </div>
</header>
  )
}
