import DashboardPageShell from "@/components/layout/DashboardPageShell";
import { getDashboardData } from "@/lib/dashboard";
import SettingsClient from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await getDashboardData();

  return (
    <DashboardPageShell data={data}>
      <section className="border-b border-[var(--border)] pb-6">
        <p className="dashboard-kicker">Workspace preferences</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Personalize your dashboard, choose the default news topic, adjust feed density, and manage saved stories. Preferences are stored in this browser.
        </p>
      </section>
      <SettingsClient />
    </DashboardPageShell>
  );
}
