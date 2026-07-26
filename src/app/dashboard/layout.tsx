import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Konten Utama (Bergeser 64 (256px) dari kiri karena lebar sidebar) */}
      <main className="flex-1 ml-64 p-8">
        {/* Opsional: Masukin Topbar di sini nanti */}
        {children}
      </main>
    </div>
  );
}