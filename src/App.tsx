import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AboutPage } from './AboutPage'
import { PrivacyPage } from './PrivacyPage'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { SearchBar } from './components/SearchBar'
import { TemperatureView } from './components/TemperatureView'
import { fetchCurrentTemperature } from './lib/api'
import {
  getCachedTemp,
  getCity,
  getUnit,
  getView,
  setCachedTemp,
  setCity as persistCity,
  setUnit as persistUnit,
  setView as persistView,
} from './lib/storage'
import type { CachedTemp, City, Unit, View } from './lib/types'

const ONE_HOUR_MS = 60 * 60 * 1000

function HomePage() {
  const [city, setCity] = useState<City | null>(() => getCity())
  const [cachedTemp, setTemp] = useState<CachedTemp | null>(() => getCachedTemp())
  const [unit, setUnit] = useState<Unit>(() => getUnit() ?? 'C')
  const [view, setView] = useState<View>(() => getView() ?? 'glass')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // On mount, refetch if the cached temperature is stale or missing.
  useEffect(() => {
    if (!city) return
    const stale = !cachedTemp || Date.now() - cachedTemp.fetchedAt > ONE_HOUR_MS
    if (stale) void refresh(city)
    // We only want this to run once on mount, using whatever hydrated initially.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    persistUnit(unit)
  }, [unit])

  useEffect(() => {
    persistView(view)
  }, [view])

  async function refresh(target: City) {
    setLoading(true)
    setError(null)
    try {
      const celsius = await fetchCurrentTemperature(target.latitude, target.longitude)
      const fresh = { celsius, fetchedAt: Date.now() }
      setTemp(fresh)
      setCachedTemp(fresh)
    } catch {
      setError("Couldn't load the latest temperature. Try again in a moment.")
    } finally {
      setLoading(false)
    }
  }

  function handleSelectCity(next: City) {
    setCity(next)
    persistCity(next)
    setTemp(null)
    void refresh(next)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="mb-6">
          <SearchBar onSelect={handleSelectCity} />
        </div>

        {city && cachedTemp ? (
          <TemperatureView
            city={city}
            celsius={cachedTemp.celsius}
            fetchedAt={cachedTemp.fetchedAt}
            unit={unit}
            view={view}
            loading={loading}
            error={error}
            onUnitChange={setUnit}
            onViewChange={setView}
            onRefresh={() => void refresh(city)}
          />
        ) : city && loading ? (
          <p className="text-center text-sm text-slate-600">Loading temperature for {city.name}…</p>
        ) : city && error ? (
          <section className="rounded-lg bg-white p-6 text-center ring-1 ring-slate-200">
            <p className="mb-3 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void refresh(city)}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-amber-50 ring-1 ring-slate-800 hover:bg-slate-700"
            >
              Retry
            </button>
          </section>
        ) : (
          <p className="text-center text-sm text-slate-600">
            Search for a city above to see its current temperature.
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  )
}
