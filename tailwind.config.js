/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan semua file app dan src
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Palet warna dark anime
        background: {
          DEFAULT: "#0f0f0f",
          card: "#1a1a2e",
          elevated: "#16213e",
        },
        primary: {
          DEFAULT: "#e94560",
          light: "#ff6b81",
          dark: "#c0392b",
        },
        accent: {
          DEFAULT: "#0f3460",
          light: "#533483",
        },
        surface: "#1e1e2e",
        border: "#2d2d3d",
        text: {
          primary: "#e2e8f0",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};