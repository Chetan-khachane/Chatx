// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
       colors: {
        background: "#F8FAFC", // subtle neutral bg
        surface: "#FFFFFF", // white cards
        primary: "#6366F1", // indigo-500 (modern)
        secondary: "#8B5CF6", // violet-500
        accent: "#EC4899", // pink-500 (funky)
        muted: "#CBD5E1", // slate-300
        text: "#0F172A", // slate-900
      },
      backgroundColor: ['after'],
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        merriweather: ["Merriweather", "serif"],
        raleway: ["Raleway", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        firasans: ["Fira Sans", "sans-serif"],
        worksans: ["Work Sans", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        ptserif: ["PT Serif", "serif"],
        inconsolata: ["Inconsolata", "monospace"],
        sourcecode: ["Source Code Pro", "monospace"],

        // default fallback stacks
        sans: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"],
        serif: ["Playfair Display", "Merriweather", "PT Serif", "serif"],
        mono: ["Source Code Pro", "Inconsolata", "monospace"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
  
};
