import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="command-grid flex min-h-screen">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
