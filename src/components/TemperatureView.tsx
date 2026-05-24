import { Thermometer } from './Thermometer'
import type { City, Unit, View } from '../lib/types'

function formatTemp(celsius: number, unit: Unit): string {
  const value = unit === 'F' ? celsius * (9 / 5) + 32 : celsius
  return `${Math.round(value * 10) / 10}°${unit}`
}

function formatCityLabel(city: City): string {
  const parts = [city.name, city.admin1, city.country].filter(Boolean) as string[]
  return parts.join(', ')
}

function formatFetchedAt(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  )
}

type ToggleButtonProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-amber-50 ring-1 ring-slate-800'
          : 'rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-amber-50'
      }
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

type Props = {
  city: City
  celsius: number
  fetchedAt: number
  unit: Unit
  view: View
  loading: boolean
  error: string | null
  onUnitChange: (unit: Unit) => void
  onViewChange: (view: View) => void
  onRefresh: () => void
}

export function TemperatureView({
  city,
  celsius,
  fetchedAt,
  unit,
  view,
  loading,
  error,
  onUnitChange,
  onViewChange,
  onRefresh,
}: Props) {
  function handleRefreshClick() {
    if (loading) return
    // Skip the API call if we already have a reading from this same minute.
    const sameMinute = Math.floor(fetchedAt / 60000) === Math.floor(Date.now() / 60000)
    if (sameMinute) return
    onRefresh()
  }

  return (
    <section className="rounded-lg bg-white p-6 ring-1 ring-slate-200">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-900">{formatCityLabel(city)}</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{loading ? 'Updating…' : `Updated ${formatFetchedAt(fetchedAt)}`}</span>
          <button
            type="button"
            onClick={handleRefreshClick}
            aria-label="Refresh temperature"
            className="rounded-md p-1 text-slate-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
            disabled={loading}
          >
            <RefreshIcon className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mb-6 flex min-h-[18rem] items-center justify-center">
        {view === 'glass' ? (
          <Thermometer celsius={celsius} unit={unit} />
        ) : (
          <div className="text-7xl font-bold text-slate-900">{formatTemp(celsius, unit)}</div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">Unit</span>
          <ToggleButton active={unit === 'C'} onClick={() => onUnitChange('C')}>°C</ToggleButton>
          <ToggleButton active={unit === 'F'} onClick={() => onUnitChange('F')}>°F</ToggleButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">View</span>
          <ToggleButton active={view === 'glass'} onClick={() => onViewChange('glass')}>
            Glass
          </ToggleButton>
          <ToggleButton active={view === 'number'} onClick={() => onViewChange('number')}>
            Number
          </ToggleButton>
        </div>
      </div>
    </section>
  )
}
