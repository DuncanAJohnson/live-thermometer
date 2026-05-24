import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-6 px-4 py-4 text-sm text-slate-600">
        <Link
          to="/about"
          className="hover:text-amber-700 hover:underline underline-offset-4"
        >
          About
        </Link>
        <Link
          to="/privacy"
          className="hover:text-amber-700 hover:underline underline-offset-4"
        >
          Privacy
        </Link>
      </div>
    </footer>
  )
}
