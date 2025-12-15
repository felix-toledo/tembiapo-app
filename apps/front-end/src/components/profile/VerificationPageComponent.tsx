"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function VerificationPageComponent() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent =
        typeof navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
      );
      setIsMobile(true);
    };

    checkIsMobile();
  }, []);

  if (isMobile === null) {
    return null; // or a loader
  }

  return (
    <div className="flex-1 flex flex-col">
      {isMobile ? <MobileBodyComponent /> : <DesktopBodyComponent />}
    </div>
  );
}

function DesktopBodyComponent() {
  const url = window.location.href;

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-8 animate-in fade-in duration-700">
      <div className="max-w-xl mx-auto space-y-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-parana-profundo)" }}
        >
          Verificación de Identidad
        </h1>
        <p className="text-lg text-gray-600">
          Para continuar con el proceso de validación, necesitamos que utilices
          tu dispositivo móvil.
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 inline-block">
          {url && (
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 256,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={url}
                viewBox={`0 0 256 256`}
                fgColor="var(--color-parana-profundo)"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-medium text-gray-800">
            Escanea el código QR para abrir esta página en tu celular.
          </p>
          <div
            className="p-4 rounded-lg bg-blue-50 text-sm"
            style={{ color: "var(--color-parana-profundo)" }}
          >
            <span className="font-bold block mb-1">💡 Recomendación:</span>
            Para una experiencia más fluida, asegúrate de haber iniciado sesión
            en tu celular antes de escanear el código.
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileBodyComponent() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: "var(--color-parana-profundo)" }}
      >
        Verificación Móvil
      </h2>
      <p className="text-center text-gray-600">
        Aquí irá el componente de carga de documentos.
      </p>
    </div>
  );
}
