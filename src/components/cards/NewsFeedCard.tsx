import type { DashboardArticle } from "@/types/dashboard";

type Props = {
  articles: DashboardArticle[];
};

function formatPublishedAt(value?: string) {
  if (!value) return "Latest";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Latest";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NewsFeedCard({ articles }: Props) {
  const items = articles.slice(0, 10);

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="dashboard-kicker">News Feed</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text)]">
            Scrollable News Stream
          </h2>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          {items.length} live items
        </p>
      </div>

      <div className="h-[420px] space-y-3 overflow-y-auto pr-2">
        {items.length > 0 ? (
          items.map((article, index) => (
            <article
              key={`${article.title}-${index}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-faint)]">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2 py-1">
                  {article.source ?? "News source"}
                </span>
                <span>{formatPublishedAt(article.publishedAt)}</span>
              </div>

              <h3 className="mt-3 text-base font-semibold leading-6 text-[var(--text)]">
                {article.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {article.description ?? "No summary available for this update."}
              </p>

              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] transition hover:opacity-80"
                >
                  Read more →
                </a>
              ) : null}
            </article>
          ))
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                No news loaded
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Connect your news source or check the fetch logic for articles.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
