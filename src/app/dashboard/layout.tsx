import { DashboardNav } from "@/components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="w-64 flex-col border-r bg-card fixed h-full hidden md:flex">
        <DashboardNav />
      </aside>
      <main className="flex flex-1 flex-col md:ml-64">
        {children}
      </main>
    </div>
  );
}
