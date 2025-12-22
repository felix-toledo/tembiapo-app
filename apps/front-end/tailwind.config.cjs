/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/**/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 8px 2px rgba(234, 88, 12, 0.4), 0 0 16px 4px rgba(234, 88, 12, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 16px 4px rgba(234, 88, 12, 0.6), 0 0 24px 8px rgba(234, 88, 12, 0.3)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
