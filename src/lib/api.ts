import type { City } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

type GeocodingResult = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

type GeocodingResponse = {
  results?: GeocodingResult[]
}

type ForecastResponse = {
  current?: {
    temperature_2m?: number
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmed = name.trim()
  if (trimmed.length < 2) return []
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`)
  const data = (await res.json()) as GeocodingResponse
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }))
}

export async function fetchCurrentTemperature(
  latitude: number,
  longitude: number,
): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=celsius`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`)
  const data = (await res.json()) as ForecastResponse
  const temp = data.current?.temperature_2m
  if (typeof temp !== 'number') throw new Error('Forecast response missing temperature_2m')
  return temp
}
