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
    ],
    qualities: [75, 80, 90], // (Lo que agregamos antes para las imágenes)
  },
};

export default nextConfig;
