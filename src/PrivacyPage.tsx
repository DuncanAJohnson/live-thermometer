import { Header } from './components/Header'
import { Footer } from './components/Footer'

export function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header rightLink={{ href: '/', label: '← Back to home' }} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-2 text-2xl font-bold">Privacy</h1>
        <p className="mb-6 text-sm text-slate-600">
          What we collect, what we don't, and why.
        </p>

        <section className="mb-6 rounded-lg bg-white p-5 ring-1 ring-slate-200">
          <p className="text-sm leading-relaxed text-slate-700">
            Live Thermometer does not collect personal information from visitors
            or students. We use Cloudflare Web Analytics to anonymously count the
            number of visits, which helps us understand how Live Thermometer is
            being used in classrooms. Cloudflare Web Analytics is cookieless,
            does not fingerprint visitors, and does not track users across other
            sites. See Cloudflare's{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              privacy policy
            </a>{' '}
            for details. We do not share, sell, or otherwise transfer any
            visitor data to third parties. Live Thermometer stores your selected
            city, the most recent temperature reading, and your unit and view
            preferences in your browser's local storage, and that information
            never leaves your device. When you search for a city or load a
            forecast, your browser sends a request directly to{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              Open-Meteo
            </a>
            's public API, which receives only the city name or coordinates you
            looked up.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            Questions or concerns? Email{' '}
            <a
              href="mailto:directors@edtechathon.com?subject=live%20thermometer%20privacy"
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              directors@edtechathon.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
