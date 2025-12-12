import { SideBar } from "@/src/components/ui/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[var(--color-gris-fondo-claro)] overflow-hidden font-primary">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
