import { Link } from 'react-router-dom'
import thermometerIcon from '../assets/thermometer.svg'

type RightLink = { href: string; label: string }

export function Header({ rightLink }: { rightLink?: RightLink }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-slate-900 hover:text-amber-700"
        >
          <img src={thermometerIcon} alt="" className="h-8 w-8" />
          Live Thermometer
        </Link>
        {rightLink ? (
          <Link
            to={rightLink.href}
            className="text-sm font-medium text-amber-700 underline-offset-4 hover:underline"
          >
            {rightLink.label}
          </Link>
        ) : null}
      </div>
    </header>
  )
}
