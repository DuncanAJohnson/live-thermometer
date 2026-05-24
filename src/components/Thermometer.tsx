import { useEffect, useState } from 'react'
import type { Unit } from '../lib/types'

// Default visible scale in Celsius. The °F display reuses the same physical
// extent so the mercury level doesn't shift when switching units — F labels
// are placed at multiples of 20 °F that fall inside the F-equivalent range.
// The C range is expanded automatically when the current temperature falls
// outside the default, so there's always at least one labelled C tick beyond
// the temp (which also pulls the F-equivalent range out far enough to expose
// the next F label).
const DEFAULT_CMIN = -30
const DEFAULT_CMAX = 40

function computeScaleRange(celsius: number): { cMin: number; cMax: number } {
  let cMin = DEFAULT_CMIN
  let cMax = DEFAULT_CMAX
  if (celsius < cMin) cMin = Math.floor(celsius / 10) * 10
  if (celsius > cMax) cMax = Math.ceil(celsius / 10) * 10
  return { cMin, cMax }
}

function cToF(c: number): number {
  return c * 1.8 + 32
}

function fToC(f: number): number {
  return (f - 32) / 1.8
}

function tickLabelsFor(unit: Unit, cMin: number, cMax: number): number[] {
  const labels: number[] = []
  if (unit === 'C') {
    for (let v = cMin; v <= cMax; v += 10) labels.push(v)
    return labels
  }
  const fMin = cToF(cMin)
  const fMax = cToF(cMax)
  const first = Math.ceil(fMin / 20) * 20
  for (let f = first; f <= fMax + 1e-9; f += 20) labels.push(f)
  return labels
}

function minorTicks(
  unit: Unit,
  zoomed: boolean,
  cMin: number,
  cMax: number,
): { medium: number[]; small: number[] } {
  const medium: number[] = []
  const small: number[] = []
  if (unit === 'F') {
    const fMin = cToF(cMin)
    const fMax = cToF(cMax)
    // Zoomed out: 5° medium ticks between the 20° labels.
    // Zoomed in:  5° medium + 1° small ticks.
    const mediumStart = Math.ceil(fMin / 5) * 5
    for (let f = mediumStart; f <= fMax + 1e-9; f += 5) {
      if (f % 20 !== 0) medium.push(f)
    }
    if (zoomed) {
      const smallStart = Math.ceil(fMin)
      for (let f = smallStart; f <= fMax + 1e-9; f += 1) {
        if (f % 5 !== 0) small.push(f)
      }
    }
    return { medium, small }
  }
  // Celsius — zoomed out: 2° medium ticks between the 10° labels.
  // Zoomed in: 5° medium + 1° small ticks.
  if (zoomed) {
    for (let c = cMin; c <= cMax; c += 5) {
      if (c % 10 !== 0) medium.push(c)
    }
    for (let c = cMin; c <= cMax; c += 1) {
      if (c % 5 !== 0) small.push(c)
    }
  } else {
    for (let c = cMin; c <= cMax; c += 2) {
      if (c % 10 !== 0) medium.push(c)
    }
  }
  return { medium, small }
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
  const { cMin, cMax } = computeScaleRange(celsius)
  const fill = Math.max(0, Math.min(1, (celsius - cMin) / (cMax - cMin)))

  const tubeTop = 20
  const tubeBottom = 240
  // Visual extensions of the outer tube. Tick math still uses tubeTop /
  // tubeBottom so the scale stays at the top of the bulb and tops out at the
  // highest visible tick. outerTubeTop adds a small expansion chamber above
  // the top tick; outerTubeBottom blends the column into the bulb.
  const outerTubeTop = 8
  const outerTubeBottom = 260
  const tubeHeight = tubeBottom - tubeTop
  const mercuryTop = tubeBottom - tubeHeight * fill
  // Inset the mercury slightly inside the glass so the white border is visible
  // around the column and the bulb.
  const mercuryLeft = 41
  const mercuryWidth = 18
  const bulbMercuryR = 21
  const labels = tickLabelsFor(unit, cMin, cMax)
  const { medium, small } = minorTicks(unit, zoomed, cMin, cMax)
  // Position any value (in the active unit) on the tube. F values get
  // converted to C first so positions track the canonical C scale.
  const yFor = (value: number): number => {
    const c = unit === 'F' ? fToC(value) : value
    const r = Math.max(0, Math.min(1, (c - cMin) / (cMax - cMin)))
    return tubeBottom - tubeHeight * r
  }

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
        const y = yFor(value)
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
        const y = yFor(value)
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
        const y = yFor(label)
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
