import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function LegacyFrame({ title, src }) {
  return (
    <div className="h-screen w-full bg-stone-100">
      <iframe
        title={title}
        src={src}
        className="h-full w-full border-0"
        loading="eager"
      />
    </div>
  )
}

function PortalLanding() {
  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_500px_at_10%_-10%,#ffd9c3_0%,transparent_60%),radial-gradient(1000px_420px_at_100%_110%,#bde4ea_0%,transparent_58%),linear-gradient(170deg,#fffaf5_0%,#f5f7f9_100%)] px-6 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-6">
          <span className="inline-flex rounded-full border border-slate-200/90 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-500 backdrop-blur-sm">
            HR Forge Workspace
          </span>
          <h1 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Choose The Dashboard You Want To Work In
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Use Workforce Hub for day-to-day HR operations and records, or open Hiring Portal for AI-assisted job description generation and direct social publishing.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Portal options">
          <article className="relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_14px_38px_rgba(17,24,39,0.14)]">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-500/10" />
            <h2 className="font-serif text-3xl font-semibold">Workforce Hub</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
              Employee lifecycle operations, documents, letters, team hierarchy, and WhatsApp coordination.
            </p>
            <a
              href="/employee-hub"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(244,96,12,0.30)] transition hover:-translate-y-px hover:bg-orange-700"
            >
              Open Workforce Hub
            </a>
          </article>

          <article className="relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_14px_38px_rgba(17,24,39,0.14)]">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-orange-500/10" />
            <h2 className="font-serif text-3xl font-semibold">Hiring Portal</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
              AI-enhanced role composition, company setup, exports, and social publishing for job posts.
            </p>
            <a
              href="/hiring-portal"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(244,96,12,0.30)] transition hover:-translate-y-px hover:bg-orange-700"
            >
              Open Hiring Portal
            </a>
          </article>
        </section>
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalLanding />} />
        <Route
          path="/employee-hub"
          element={<LegacyFrame title="Workforce Hub" src="/legacy/employee-hub.html" />}
        />
        <Route
          path="/hiring-portal"
          element={<LegacyFrame title="Hiring Portal" src="/legacy/hiring-portal.html" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
