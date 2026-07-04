import Shell from "@/components/layout/Shell";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ScenarioCard from "@/components/cards/ScenarioCard";
import { buildAIBrief } from "@/lib/dashboard-helpers";
import type { DashboardData } from "@/types/dashboard";

type DashboardPageShellProps = {
  data: DashboardData;
  children: React.ReactNode;
};

export default function DashboardPageShell({
  data,
  children,
}: DashboardPageShellProps) {
  const aiBrief = buildAIBrief(data);

  return (
    <Shell
      sidebar={<Sidebar />}
      header={<Header />}
      rightPanel={<ScenarioCard aiBrief={aiBrief} />}
    >
      <div className="mx-auto max-w-[1120px] space-y-6">{children}</div>
    </Shell>
  );
}
