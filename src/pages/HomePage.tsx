import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import MallDetailsCard from '../components/mall/MallDetailsCard'
import MallListPanel from '../components/mall/MallListPanel'
import MallSearchBox from '../components/mall/MallSearchBox'
import StatusFilterBar from '../components/mall/StatusFilterBar'
import AppHeader from '../components/ui/AppHeader'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import LoadingState from '../components/ui/LoadingState'
import { useAsync } from '../hooks/useAsync'
import { useCountries } from '../hooks/useCountries'
import { useMalls } from '../hooks/useMalls'
import { useNow } from '../hooks/useNow'
import { filterMallsByStatus } from '../logic/filterMallsByStatus'
import type { StatusFilter } from '../logic/filterMallsByStatus'
import CountryMarkers from '../map/CountryMarkers'
import MallFocus from '../map/MallFocus'
import MallMarkers from '../map/MallMarkers'
import MapController from '../map/MapController'
import MapView from '../map/MapView'
import type { Country } from '../types/country'
import type { Mall } from '../types/mall'
import NearestMallButton from '../components/mall/NearestMallButton'
type MallsState = ReturnType<typeof useAsync<Mall[]>>['state']

const CHIP = 'pointer-events-auto w-fit rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur'

const BACK_BUTTON = [
  'pointer-events-auto flex w-fit items-center gap-2 rounded-xl bg-white/95',
  'px-3 py-2 text-sm font-medium shadow-lg backdrop-blur hover:bg-white',
  'focus:outline-none focus:ring-2 focus:ring-rose-500',
].join(' ')

export default function HomePage() {
  const { state: countriesState, retry: retryCountries } = useCountries()
  const [selected, setSelected] = useState<Country | null>(null)
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const { state: mallsState, retry: retryMalls } = useMalls(selected?.code ?? null)
  const now = useNow()
  const [resetKey, setResetKey] = useState(0)

  const countries = countriesState.status === 'success' ? countriesState.data : []
  const allMalls = mallsState.status === 'success' ? mallsState.data : []

  const visibleMalls = useMemo(
    () => filterMallsByStatus(allMalls, filter, now),
    [allMalls, filter, now],
  )
  const visibleState: MallsState =
    mallsState.status === 'success'
      ? { status: 'success', data: visibleMalls }
      : mallsState

  const selectCountry = (country: Country) => {
    setSelectedMall(null)
    setSelected(country)
  }

  const backToWorld = () => {
  setSelected(null)
  setSelectedMall(null)
  setFilter('all')
  setResetKey((k) => k + 1)
}

  const selectMallFromSearch = (mall: Mall) => {
    const country = countries.find((c) => c.code === mall.countryCode)
    if (country) setSelected(country)
    setSelectedMall(mall)
  }

  const filterEmptyMessage =
    filter === 'all' || !selected
      ? undefined
      : `No ${filter === 'open' ? 'open' : 'closed'} malls in ${selected.name} right now.`

  return (
    <div className="relative h-full w-full">
      <MapView>
        <MapController target={selected} />
        <MallFocus mall={selectedMall} />
        {!selected && <CountryMarkers countries={countries} onSelect={selectCountry} />}
        {selected && (
          <MallMarkers
            malls={visibleMalls}
            selectedMallId={selectedMall?.id ?? null}
            onSelect={setSelectedMall}
          />
        )}
      </MapView>

    <div className="pointer-events-none absolute left-4 top-4 z-[1100] flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-y-auto">        <AppHeader />
       <MallSearchBox key={`search-${resetKey}`} onSelect={selectMallFromSearch} />
<NearestMallButton key={`nearest-${resetKey}`} onFound={selectMallFromSearch} />
        {selected && (
          <>
            <button onClick={backToWorld} className={BACK_BUTTON}>
              <ArrowLeft size={16} /> Back to world
            </button>

            <div className={selectedMall ? 'hidden md:block' : ''}>
              <div className="flex flex-col gap-2">
                <StatusFilterBar value={filter} onChange={setFilter} />
                <MallListPanel
                  country={selected}
                  state={visibleState}
                  selectedMallId={selectedMall?.id ?? null}
                  onSelectMall={setSelectedMall}
                  onRetry={retryMalls}
                  emptyMessage={filterEmptyMessage}
                />
              </div>
            </div>
          </>
        )}

        {!selected && countriesState.status === 'loading' && (
          <div className={CHIP}>
            <LoadingState message="Loading countries…" />
          </div>
        )}
        {!selected && countriesState.status === 'error' && (
          <div className={CHIP}>
            <ErrorState message={countriesState.error.message} onRetry={retryCountries} />
          </div>
        )}
        {!selected && countriesState.status === 'success' && countries.length === 0 && (
          <div className={CHIP}>
            <EmptyState message="No countries available." />
          </div>
        )}
      </div>

      {selectedMall && (
        <div className="absolute inset-x-0 bottom-0 z-[1100] md:inset-x-auto md:bottom-4 md:right-4 md:w-96">
          <MallDetailsCard
            key={selectedMall.id}
            mall={selectedMall}
            onClose={() => setSelectedMall(null)}
          />
        </div>
      )}
    </div>
  )
}