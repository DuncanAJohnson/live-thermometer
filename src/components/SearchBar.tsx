import { useState } from 'react'
import { searchCities } from '../lib/api'
import type { City } from '../lib/types'

type Status = 'idle' | 'loading' | 'error' | 'no-results' | 'results'

export function SearchBar({ onSelect }: { onSelect: (city: City) => void }) {
  const [value, setValue] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [status, setStatus] = useState<Status>('idle')

  async function runSearch() {
    const trimmed = value.trim()
    if (trimmed.length < 2) return
    setStatus('loading')
    try {
      const found = await searchCities(trimmed)
      if (found.length === 0) {
        setResults([])
        setStatus('no-results')
      } else {
        setResults(found)
        setStatus('results')
      }
    } catch {
      setResults([])
      setStatus('error')
    }
  }

  function handlePick(city: City) {
    onSelect(city)
    setValue('')
    setResults([])
    setStatus('idle')
  }

  const canSearch = value.trim().length >= 2 && status !== 'loading'

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void runSearch()
            }
          }}
          placeholder="Search for a city…"
          className="flex-1 rounded-lg bg-white px-4 py-3 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700"
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          disabled={!canSearch}
          className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-medium text-amber-50 ring-1 ring-slate-800 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </div>
      {status === 'loading' ? (
        <p className="mt-2 text-sm text-slate-600">Searching…</p>
      ) : null}
      {status === 'error' ? (
        <p className="mt-2 text-sm text-red-700">
          Couldn't reach the geocoding service. Try again.
        </p>
      ) : null}
      {status === 'no-results' ? (
        <p className="mt-2 text-sm text-slate-600">No cities matched that search.</p>
      ) : null}
      {status === 'results' && results.length > 0 ? (
        <ul className="mt-2 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
          {results.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handlePick(city)}
                className="block w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-amber-50"
              >
                <span className="font-semibold">{city.name}</span>
                {city.admin1 ? <span className="text-slate-600">, {city.admin1}</span> : null}
                {city.country ? <span className="text-slate-600">, {city.country}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
