/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {    
        background: "#f7f7f7",
        primaryRed: "#E53935",
        primaryRedDark: "#B71C1C",
        textPrimary: "#212121",
        textSecondary: "#757575",
      },
    },
  },
  plugins: [],
}