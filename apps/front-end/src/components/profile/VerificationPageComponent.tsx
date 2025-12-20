"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import {
  CameraIcon,
  CheckCircle2,
  ChevronRight,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

type VerificationStep =
  | "intro"
  | "dni"
  | "selfie"
  | "processing"
  | "success"
  | "error"
  | "manual_review";

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
      setIsMobile(mobile);
    };

    checkIsMobile();
  }, []);

  if (isMobile === null) {
    return null; // or a loader
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
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
  const [step, setStep] = useState<VerificationStep>("intro");
  const [dniImage, setDniImage] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { verification } = useAuth(); // Get verification status from context
  useEffect(() => {
    if (verification) {
      // If verification exists and is NOT approved, go to manual review
      if (verification.status !== "ok" && verification.status !== "okByAdmin") {
        setStep("manual_review");
      }
    }
  }, [verification]);

  const handleStart = () => setStep("dni");

  const handleDniCapture = (blob: Blob) => {
    setDniImage(blob);
    setStep("selfie");
  };

  const handleSelfieCapture = (blob: Blob) => {
    handleSubmit(dniImage!, blob);
  };

  const handleSubmit = async (dni: Blob, selfie: Blob) => {
    setStep("processing");
    try {
      const formData = new FormData();
      formData.append("dni", dni, "dni.jpg");
      formData.append("selfie", selfie, "selfie.jpg");

      // Use local proxy which handles auth token
      const response = await fetch("/api/profile/verify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la verificación");
      }

      const data = await response.json();

      if (data.match) {
        setStep("success");
      } else {
        setStep("manual_review");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(
        "Ocurrió un error al verificar tu identidad. Por favor intenta nuevamente."
      );
      setStep("error");
    }
  };

  const handleRetry = () => {
    setDniImage(null);
    setErrorMsg("");
    setStep("intro");
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50">
      {step === "intro" && <IntroStep onStart={handleStart} />}
      {step === "dni" && (
        <CameraStep
          type="dni"
          onCapture={handleDniCapture}
          instruction="Ubica el frente de tu DNI en el rectángulo"
        />
      )}
      {step === "selfie" && (
        <CameraStep
          type="selfie"
          onCapture={handleSelfieCapture}
          instruction="Ubica tu rostro en el óvalo"
        />
      )}
      {step === "processing" && <ProcessingStep />}
      {step === "success" && <SuccessStep />}
      {step === "manual_review" && <ManualReviewStep />}
      {step === "error" && (
        <ErrorStep message={errorMsg} onRetry={handleRetry} />
      )}
    </div>
  );
}

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col flex-1 p-6 items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
        <CameraIcon className="w-10 h-10" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Vamos a verificar tu identidad
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Para brindarte mayor seguridad, necesitamos validar que sos vos. Tené
          a mano tu{" "}
          <span className="font-semibold text-gray-900">DNI físico</span> y
          asegurate de estar en un lugar bien iluminado.
        </p>
      </div>

      <div className="w-full pt-8">
        <button
          onClick={onStart}
          className="w-full py-4 bg-parana-profundo text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Comenzar verificación
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function CameraStep({
  type,
  onCapture,
  instruction,
}: {
  type: "dni" | "selfie";
  onCapture: (blob: Blob) => void;
  instruction: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: type === "selfie" ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert(
          "No pudimos acceder a la cámara. Por favor verificá los permisos."
        );
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [type]);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Find center and size for cropping based on overlay
        // This takes the full frame for simplicity to backend, but usually you'd want to crop
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              onCapture(blob);
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  }, [onCapture]);

  return (
    <div className="relative flex-1 flex flex-col bg-black overflow-hidden">
      {/* Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          type === "selfie" ? "scale-x-[-1]" : ""
        }`}
      />

      {/* Overlay - Darkened area with cutout */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/40">
          {/* Cutout shape */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ${
              type === "dni"
                ? "w-[85%] aspect-[1.586/1] rounded-lg" // ID Card ratio
                : "w-[70%] aspect-3/4 rounded-full" // Selfie oval
            }`}
          >
            {/* Scan animation line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite] opacity-60" />
          </div>
        </div>
      </div>

      {/* UI Elements */}
      <div className="relative flex-1 flex flex-col justify-between p-6 z-10">
        <div className="mt-8 text-center">
          <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-sm font-medium">
            {instruction}
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className="w-16 h-16 bg-white rounded-full" />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style jsx>{`
        @keyframes scan {
          0%,
          100% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function ProcessingStep() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-blue-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-parana-profundo animate-spin" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Verificando...</h3>
        <p className="text-gray-500">
          Estamos analizando tus datos biométricos.
        </p>
      </div>
    </div>
  );
}

function SuccessStep() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Identidad Verificada!
        </h3>
        <p className="text-gray-600">
          Ya podés disfrutar de todos los beneficios de tu cuenta profesional.
        </p>
      </div>
      <div className="w-full pt-8">
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}

function ManualReviewStep() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-2">
        <div className="text-4xl font-bold">?</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Verificación en Proceso
        </h3>
        <p className="text-gray-600">
          Tu identidad no pudo ser verificada automáticamente, pero no te
          preocupes, un administrador va a estar chequeando tus datos para ver
          si hubo un error.
        </p>
      </div>
      <div className="w-full pt-8">
        <button
          onClick={() => router.push("/user")}
          className="w-full py-4 bg-yellow-600 text-white rounded-xl font-semibold shadow-lg shadow-yellow-900/20 active:scale-[0.98] transition-all"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}

function ErrorStep({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in shake">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
        <div className="text-4xl font-bold">!</div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Hubo un problema
        </h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="w-full pt-8">
        <button
          onClick={onRetry}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
}
