import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ScenarioCard from "@/components/cards/ScenarioCard";
import type { AIBrief } from "@/types/dashboard";

const aiBrief: AIBrief = {
  whatThisMeans:
    "This page currently documents planned workspace controls. The listed preferences are informational placeholders and are not interactive settings yet.",
  keyTakeaways: [
    "Theme controls are available through the theme switcher.",
    "Alert thresholds and notification routing are not implemented.",
    "API keys should be configured as deployment environment variables, not entered into this page.",
  ],
  featuredTitle: "Settings overview",
  scenarios: [],
};

const settingGroups = [
  {
    title: "Appearance",
    items: ["Theme mode: use the theme switcher", "Density: not implemented", "Card contrast: follows the selected theme"],
  },
  {
    title: "Signals",
    items: ["Confidence threshold: not implemented", "Priority topics: use dashboard filters", "Noise reduction: not implemented"],
  },
  {
    title: "Workspace",
    items: ["Saved views: not implemented", "Watchlist: stored in this browser", "Notification routing: not implemented"],
  },
];

export default function SettingsPage() {
  return (
    <Shell
      sidebar={<Sidebar />}
      header={<Header />}
      rightPanel={<ScenarioCard aiBrief={aiBrief} />}
    >
      <div className="mx-auto max-w-[1120px] space-y-6">
        <section>
          <p className="dashboard-kicker">Workspace Control</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Available controls and planned preferences. Items marked not
            implemented are informational only and do not change app behavior.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {settingGroups.map((group) => (
            <article key={group.title} className="card p-5">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text-muted)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </Shell>
  );
}
