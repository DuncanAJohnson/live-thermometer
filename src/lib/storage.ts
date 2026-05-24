import type { CachedTemp, City, Unit, View } from './types'

const KEY_CITY = 'thermometer.city'
const KEY_TEMP = 'thermometer.temp'
const KEY_UNIT = 'thermometer.unit'
const KEY_VIEW = 'thermometer.view'

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage may be unavailable (private mode, quota) — silently ignore
  }
}

export const getCity = (): City | null => read<City>(KEY_CITY)
export const setCity = (city: City): void => write(KEY_CITY, city)

export const getCachedTemp = (): CachedTemp | null => read<CachedTemp>(KEY_TEMP)
export const setCachedTemp = (temp: CachedTemp): void => write(KEY_TEMP, temp)

export const getUnit = (): Unit | null => {
  const v = read<Unit>(KEY_UNIT)
  return v === 'C' || v === 'F' ? v : null
}
export const setUnit = (unit: Unit): void => write(KEY_UNIT, unit)

export const getView = (): View | null => {
  const v = read<View>(KEY_VIEW)
  return v === 'glass' || v === 'number' ? v : null
}
export const setView = (view: View): void => write(KEY_VIEW, view)
