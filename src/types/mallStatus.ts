import type { DayHours } from './operatingHours'

/**
 * open        -> inside today's opening window
 * closed      -> outside the window, or explicitly closed today
 * unavailable -> hours missing or invalid, so we can't tell
 */
export type MallStatusKind = 'open' | 'closed' | 'unavailable'

export interface MallStatus {
  status: MallStatusKind
  todayHours: DayHours | null
  reason:
    | 'within-hours'
    | 'before-opening'
    | 'after-closing'
    | 'closed-today'
    | 'missing-hours'
    | 'invalid-hours'
    | 'invalid-timezone'
}