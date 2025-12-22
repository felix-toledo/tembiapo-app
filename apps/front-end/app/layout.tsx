import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../src/lib/registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://tembiapo.app"
  ),
  title: {
    default: "Tembiapó",
    template: "%s | Tembiapó",
  },
  description:
    "Encontrá profesionales de confianza en el NEA. Plomeros, electricistas, limpieza y más servicios para tu hogar o empresa.",
  keywords: [
    "servicios",
    "profesionales",
    "NEA",
    "Argentina",
    "plomeros",
    "electricistas",
    "limpieza",
    "hogar",
    "mantenimiento",
    "oficios",
    "trabajo",
    "contratar",
  ],
  authors: [{ name: "Tembiapó Team" }],
  creator: "Tembiapó",
  publisher: "Tembiapó",
  openGraph: {
    title: "Tembiapó - Profesionales de Confianza",
    description:
      "La plataforma líder en el NEA para encontrar y contratar profesionales calificados. Soluciones rápidas y seguras para tu hogar.",
    url: "https://tembiapo.app",
    siteName: "Tembiapó",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Tembiapó - Conectando profesionales y clientes",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tembiapó",
    description: "Encontrá profesionales de confianza en el NEA.",
    creator: "@tembiapo",
    images: ["/og_image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://tembiapo.app",
  },
};

import { AuthProvider } from "../src/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
