"use client";

import { useEffect, useState } from "react";
import LoaderWaiterMini from "@/src/components/ui/loaders/LoaderWaiterMini";

interface Professional {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  avatarURL: string;
  description: string;
  whatsappContact: string;
  isVerified: boolean;
  area: Array<{
    id: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    isMain: boolean;
  }>;
  fields: Array<{
    id: string;
    name: string;
    isMain: boolean;
  }>;
}

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchProfessionals();
  }, []);

  async function fetchProfessionals() {
    try {
      const res = await fetch("/api/professionals");
      const data = await res.json();
      
      if (data.success && data.data && data.data.professionals) {
        setProfessionals(data.data.professionals);
      }
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProfessionals = professionals.filter((prof) => {
    const fullName = `${prof.name} ${prof.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      prof.username.toLowerCase().includes(search.toLowerCase());
    
    const matchesVerified =
      verifiedFilter === "ALL" ||
      (verifiedFilter === "VERIFIED" && prof.isVerified) ||
      (verifiedFilter === "UNVERIFIED" && !prof.isVerified);
    
    return matchesSearch && matchesVerified;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoaderWaiterMini />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profesionales</h1>
        <p className="text-gray-700 mt-2">Gestión de profesionales registrados</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos</option>
            <option value="VERIFIED">Verificados</option>
            <option value="UNVERIFIED">No Verificados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rubros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Áreas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron profesionales
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((prof) => (
                  <tr key={prof.professionalId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {prof.name} {prof.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{prof.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {prof.fields.map((f, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 text-xs rounded-full ${
                              f.isMain
                                ? "bg-blue-100 text-blue-800 font-semibold"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {prof.area
                          .map((a) => `${a.city}, ${a.province}`)
                          .join(" | ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          prof.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {prof.isVerified ? "Verificado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prof.whatsappContact}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Mostrando {filteredProfessionals.length} de {professionals.length} profesionales
        </div>
      </div>
    </div>
  );
}
