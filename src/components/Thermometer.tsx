import { useEffect, useState } from 'react'
import type { Unit } from '../lib/types'

const MIN_C = -40
const MAX_C = 50

// Tick values shown in the active unit. Positions on the tube are computed
// from each label's celsius equivalent, so the tick spacing stays correct
// against the underlying −40…50 °C scale.
const TICK_LABELS_C = [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50]
const TICK_LABELS_F = [-40, -20, 0, 20, 40, 60, 80, 100, 120]

function minorTicks(unit: Unit, zoomed: boolean): { medium: number[]; small: number[] } {
  const medium: number[] = []
  const small: number[] = []
  if (unit === 'F') {
    // Zoomed out: 5° medium ticks between the 20° labels.
    // Zoomed in:  5° medium + 1° small ticks.
    for (let f = -40; f <= 120; f += 5) {
      if (f % 20 !== 0) medium.push(f)
    }
    if (zoomed) {
      for (let f = -40; f <= 120; f += 1) {
        if (f % 5 !== 0) small.push(f)
      }
    }
    return { medium, small }
  }
  // Celsius — zoomed out: 2° medium ticks between the 10° labels.
  // Zoomed in: 5° medium + 1° small ticks.
  if (zoomed) {
    for (let c = -40; c <= 50; c += 5) {
      if (c % 10 !== 0) medium.push(c)
    }
    for (let c = -40; c <= 50; c += 1) {
      if (c % 5 !== 0) small.push(c)
    }
  } else {
    for (let c = -40; c <= 50; c += 2) {
      if (c % 10 !== 0) medium.push(c)
    }
  }
  return { medium, small }
}

function toCelsius(value: number, unit: Unit): number {
  return unit === 'F' ? ((value - 32) * 5) / 9 : value
}

function ratioFor(celsius: number): number {
  const clamped = Math.max(MIN_C, Math.min(MAX_C, celsius))
  return (clamped - MIN_C) / (MAX_C - MIN_C)
}

function ThermometerSvg({
  celsius,
  unit,
  height,
  zoomed = false,
}: {
  celsius: number
  unit: Unit
  height: number | string
  zoomed?: boolean
}) {
  const fill = ratioFor(celsius)
  const tubeTop = 20
  const tubeBottom = 240
  // Visual extensions of the outer tube. Tick math still uses tubeTop /
  // tubeBottom so the scale stays at the top of the bulb and tops out at 50°C.
  // outerTubeTop adds a small expansion chamber above the highest tick;
  // outerTubeBottom blends the column into the bulb.
  const outerTubeTop = 8
  const outerTubeBottom = 260
  const tubeHeight = tubeBottom - tubeTop
  const mercuryTop = tubeBottom - tubeHeight * fill
  // Inset the mercury slightly inside the glass so the white border is visible
  // around the column and the bulb.
  const mercuryLeft = 41
  const mercuryWidth = 18
  const bulbMercuryR = 21
  const labels = unit === 'F' ? TICK_LABELS_F : TICK_LABELS_C
  const { medium, small } = minorTicks(unit, zoomed)

  return (
    <svg
      viewBox="0 0 140 300"
      style={{ height }}
      className="w-auto"
      role="img"
      aria-label={`Thermometer showing ${
        Math.round((unit === 'F' ? celsius * 1.8 + 32 : celsius) * 10) / 10
      }°${unit}`}
    >
      <defs>
        <clipPath id="tube-clip">
          <rect x="40" y={tubeTop} width="20" height={outerTubeBottom - tubeTop} rx="10" ry="10" />
          <circle cx="50" cy="260" r="22" />
        </clipPath>
      </defs>

      <rect
        x="40"
        y={outerTubeTop}
        width="20"
        height={outerTubeBottom - outerTubeTop}
        rx="10"
        ry="10"
        fill="#fff"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <circle cx="50" cy="260" r="22" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />

      <g clipPath="url(#tube-clip)">
        <circle cx="50" cy="260" r={bulbMercuryR} fill="#cb211e" />
        <rect
          x={mercuryLeft}
          y={mercuryTop}
          width={mercuryWidth}
          height={outerTubeBottom - mercuryTop}
          fill="#cb211e"
        />
      </g>

      {small.map((value) => {
        const y = tubeBottom - tubeHeight * ratioFor(toCelsius(value, unit))
        return (
          <line
            key={`s-${value}`}
            x1="61"
            x2="64"
            y1={y}
            y2={y}
            stroke="#cbd5e1"
            strokeWidth="0.6"
          />
        )
      })}

      {medium.map((value) => {
        const y = tubeBottom - tubeHeight * ratioFor(toCelsius(value, unit))
        return (
          <line
            key={`m-${value}`}
            x1="61"
            x2="67"
            y1={y}
            y2={y}
            stroke="#94a3b8"
            strokeWidth="1"
          />
        )
      })}

      {labels.map((label) => {
        const labelC = toCelsius(label, unit)
        const y = tubeBottom - tubeHeight * ratioFor(labelC)
        return (
          <g key={label}>
            <line x1="61" x2="70" y1={y} y2={y} stroke="#475569" strokeWidth="1.5" />
            <text
              x="74"
              y={y + 4}
              fontSize="11"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fill="#334155"
            >
              {label}°{unit}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function MagnifierIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  )
}

export function Thermometer({ celsius, unit }: { celsius: number; unit: Unit }) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!zoomed) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoomed])

  return (
    <div className="flex flex-col items-center gap-2">
      <ThermometerSvg celsius={celsius} unit={unit} height={288} />
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label="Zoom into thermometer"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200 hover:bg-amber-50 hover:text-amber-700"
      >
        <MagnifierIcon className="h-4 w-4" />
        Zoom
      </button>

      {zoomed ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed thermometer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative flex max-h-[96vh] max-w-[96vw] items-center justify-center rounded-lg bg-white p-6 ring-1 ring-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Close zoomed view"
              className="absolute right-3 top-3 rounded-md px-2 py-1 text-base text-slate-600 hover:bg-amber-50 hover:text-amber-700"
            >
              ✕
            </button>
            <ThermometerSvg celsius={celsius} unit={unit} height="min(1100px, 88vh)" zoomed />
          </div>
        </div>
      ) : null}
    </div>
  )
}
