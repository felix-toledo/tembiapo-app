import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // ESTO ES VITAL: Le dice a Next que maneje los hashes de styled-components
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**", // Permite cualquier ruta dentro de picsum
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Agrego este también porque lo usaste en los mocks
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Por si usas placeholders simples
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
    qualities: [75, 80, 90], // (Lo que agregamos antes para las imágenes)
  },
};

export default nextConfig;
