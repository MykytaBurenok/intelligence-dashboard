export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-10" aria-busy="true" aria-label="Loading intelligence dashboard">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="loading-orb" aria-hidden="true" />
            <div>
              <p className="dashboard-kicker">Intelligence workspace</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">Preparing your workspace</h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Connecting market context and arranging your briefing.</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--text-muted)] sm:inline-flex">
            Loading live data
          </span>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(210px,260px)_minmax(0,1fr)_minmax(280px,340px)]">
          <aside className="hidden space-y-3 xl:block">
            <div className="card space-y-4 p-5">
              <div className="loading-pulse h-10 rounded-xl" />
              {Array.from({ length: 6 }, (_, index) => <div key={index} className="loading-pulse h-11 rounded-xl" />)}
            </div>
          </aside>
          <section className="min-w-0 space-y-5">
            <div className="card space-y-4 p-6">
              <div className="loading-pulse h-3 w-32 rounded-full" />
              <div className="loading-pulse h-8 w-3/4 rounded-lg" />
              <div className="loading-pulse h-4 w-full rounded-full" />
              <div className="loading-pulse h-4 w-2/3 rounded-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="card space-y-4 p-5"><div className="loading-pulse h-3 w-24 rounded-full" /><div className="loading-pulse h-8 w-2/3 rounded-lg" /><div className="loading-pulse h-3 w-full rounded-full" /><div className="loading-pulse h-3 w-1/2 rounded-full" /></div>)}
            </div>
            <div className="card space-y-4 p-6">
              <div className="loading-pulse h-5 w-48 rounded-lg" />
              {Array.from({ length: 3 }, (_, index) => <div key={index} className="flex gap-4"><div className="loading-pulse h-16 w-20 shrink-0 rounded-xl" /><div className="flex-1 space-y-3"><div className="loading-pulse h-4 w-full rounded-full" /><div className="loading-pulse h-3 w-4/5 rounded-full" /></div></div>)}
            </div>
          </section>
          <aside className="hidden space-y-4 xl:block">
            <div className="card space-y-4 p-5"><div className="loading-pulse h-3 w-28 rounded-full" /><div className="loading-pulse h-6 w-4/5 rounded-lg" /><div className="loading-pulse h-24 rounded-xl" /><div className="loading-pulse h-4 w-full rounded-full" /><div className="loading-pulse h-4 w-5/6 rounded-full" /></div>
            <div className="card space-y-4 p-5"><div className="loading-pulse h-4 w-2/3 rounded-lg" /><div className="loading-pulse h-16 rounded-xl" /></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
