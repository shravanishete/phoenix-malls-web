import { useCallback, useState } from 'react'
import { findNearestMall } from '../logic/findNearestMall'
import type { NearestMall } from '../logic/findNearestMall'
import { getCurrentPosition } from '../services/locationService'
import { mallService } from '../services/mallService'
import type { Mall } from '../types/mall'

export type NearestState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'error'; message: string }
  | { status: 'found'; result: NearestMall<Mall> }

export function useNearestMall() {
  const [state, setState] = useState<NearestState>({ status: 'idle' })

  const find = useCallback(async (): Promise<NearestMall<Mall> | null> => {
    setState({ status: 'locating' })
    try {
      const position = await getCurrentPosition()
      const malls = await mallService.getAllMalls()
      const result = findNearestMall(malls, position)
      if (!result) {
        setState({ status: 'error', message: 'No malls are available.' })
        return null
      }
      setState({ status: 'found', result })
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.'
      setState({ status: 'error', message })
      return null
    }
  }, [])

  return { state, find }
}