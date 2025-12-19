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
      totalProfessionals:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users.data?.filter((u: any) => u.role?.name === "PROFESSIONAL")
          .length || 0,
      totalFields: fields.data?.length || 0,
      totalAreas: areas.data?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalUsers: 0,
      totalProfessionals: 0,
      totalFields: 0,
      totalAreas: 0,
    };
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Actividad Reciente
        </h2>
        <p className="text-gray-700">No hay actividad reciente para mostrar</p>
      </div>
    </div>
  );
}

import { useAuth } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // const { user } = useAuth();

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-screen">
          <LoaderWaiterMini />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
