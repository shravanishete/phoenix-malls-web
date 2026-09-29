import { mallService } from '../services/mallService'
import type { Country } from '../types/country'
import { useAsync } from './useAsync'

export function useCountries() {
  return useAsync<Country[]>(mallService.getCountries)
}