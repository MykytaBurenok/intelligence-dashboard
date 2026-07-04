import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ScenarioCard from "@/components/cards/ScenarioCard";
import type { AIBrief } from "@/types/dashboard";

const aiBrief: AIBrief = {
  whatThisMeans:
    "Settings controls the display layer, workspace behavior, and future personalization options.",
  keyTakeaways: [
    "Theme state should stay accessible and easy to reach.",
    "Workspace preferences can be grouped by display, alerts, and data.",
    "This page is a good place for future account and API controls.",
  ],
  featuredTitle: "Settings overview",
  scenarios: [
    { label: "Theme customization", probability: 72 },
    { label: "Alert controls", probability: 51 },
    { label: "Workspace sync", probability: 33 },
  ],
};

const settingGroups = [
  {
    title: "Appearance",
    items: ["Theme mode", "Density", "Card contrast"],
  },
  {
    title: "Signals",
    items: ["Confidence threshold", "Priority topics", "Noise reduction"],
  },
  {
    title: "Workspace",
    items: ["Saved views", "Watch presets", "Notification routing"],
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
            Manage dashboard behavior, visual preferences, and workspace-level
            controls.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {settingGroups.map((group) => (
            <article key={group.title} className="card p-5">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {group.title}
              </h2>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </Shell>
  );
}
