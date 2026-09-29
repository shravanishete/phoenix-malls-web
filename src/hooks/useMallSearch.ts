import { useCallback } from 'react'
import { mallService } from '../services/mallService'
import type { Mall } from '../types/mall'
import { useAsync } from './useAsync'
import { useDebouncedValue } from './useDebouncedValue'

const NO_RESULTS: Mall[] = []
const MIN_LENGTH = 2

export function useMallSearch(query: string) {
  const debounced = useDebouncedValue(query.trim())

  const load = useCallback(
    () =>
      debounced.length >= MIN_LENGTH
        ? mallService.searchMalls(debounced)
        : Promise.resolve(NO_RESULTS),
    [debounced],
  )

  return useAsync<Mall[]>(load)
}