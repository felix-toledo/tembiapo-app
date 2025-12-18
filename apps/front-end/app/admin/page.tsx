import { Suspense } from "react";
import LoaderWaiterMini from "@/src/components/ui/loaders/LoaderWaiterMini";

async function getStats() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    const [usersRes, fieldsRes, areasRes] = await Promise.all([
      fetch(`${API_URL}/api/v1/users`, { cache: "no-store" }),
      fetch(`${API_URL}/api/v1/fields`, { cache: "no-store" }),
      fetch(`${API_URL}/api/v1/service-areas`, { cache: "no-store" }),
    ]);

    const users = usersRes.ok ? await usersRes.json() : { data: [] };
    const fields = fieldsRes.ok ? await fieldsRes.json() : { data: [] };
    const areas = areasRes.ok ? await areasRes.json() : { data: [] };

    return {
      totalUsers: users.data?.length || 0,
      totalProfessionals: users.data?.filter((u: any) => u.role?.name === "PROFESSIONAL").length || 0,
      totalFields: fields.data?.length || 0,
      totalAreas: areas.data?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { totalUsers: 0, totalProfessionals: 0, totalFields: 0, totalAreas: 0 };
  }
}

async function DashboardContent() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 mt-2">Vista general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Profesionales"
          value={stats.totalProfessionals}
          icon="👨‍💼"
          color="green"
        />
        <StatCard
          title="Rubros"
          value={stats.totalFields}
          icon="🛠️"
          color="purple"
        />
        <StatCard
          title="Áreas"
          value={stats.totalAreas}
          icon="📍"
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <p className="text-gray-700">No hay actividad reciente para mostrar</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    green: "bg-green-100 text-green-700 border-green-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
  }[color];

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen">
        <LoaderWaiterMini />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
