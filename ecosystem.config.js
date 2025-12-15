module.exports = {
  apps: [
    {
      name: "tembiapo-back",
      script: "dist/main.js",
      cwd: "./apps/back-end", // Directorio de trabajo
      instances: 1,
      env: {
        PORT: 3001, // Puerto interno del back
        NODE_ENV: "production",
        // Tus variables de DB acá o en un .env
      },
    },
    {
      name: "tembiapo-front",
      script: "pnpm",
      args: "start", // Next.js start script
      cwd: "./apps/front-end",
      instances: 1,
      env: {
        PORT: 3000, // Puerto interno del front
        NODE_ENV: "production",
      },
    },
  ],
};
