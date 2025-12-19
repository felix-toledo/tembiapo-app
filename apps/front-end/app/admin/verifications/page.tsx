"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";

interface Verification {
  id: string;
  frontDniPictureUrl: string;
  verifiedPictureUrl: string;
  status: "ok" | "pending" | "rejected" | "okByAdmin";
  createdAt: string;
  updatedAt: string;
  person: {
    user: {
      username: string;
      mail: string;
      id: string;
    };
  };
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const data = await res.json();
        setVerifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch verifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "okByAdmin" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status } : v))
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const openImageModal = (url: string) => {
    setSelectedImage(url);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="p-8">Cargando verificaciones...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Solicitudes de Verificación
      </h1>

      {verifications.length === 0 ? (
        <p className="text-gray-900">No hay solicitudes pendientes.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  DNI (Frente)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Selfie
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {verifications.map((verification) => (
                <tr key={verification.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {verification.person.user.username || "Sin nombre"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {verification.person.user.mail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(verification.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        openImageModal(verification.frontDniPictureUrl)
                      }
                    >
                      <Image
                        src={verification.frontDniPictureUrl}
                        alt="DNI"
                        width={60}
                        height={40}
                        className="rounded object-cover"
                        style={{ width: "60px", height: "40px" }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        openImageModal(verification.verifiedPictureUrl)
                      }
                    >
                      <Image
                        src={verification.verifiedPictureUrl}
                        alt="Selfie"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        verification.status === "ok" ||
                        verification.status === "okByAdmin"
                          ? "bg-green-100 text-green-800"
                          : verification.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {verification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(verification.id, "okByAdmin")
                        }
                        className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Aprobar"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(verification.id, "rejected")
                        }
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Rechazar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          title="Vista Previa de Imagen"
        >
          <div className="flex justify-center items-center p-4">
            <img
              src={selectedImage}
              alt="Vista completa"
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
