/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent": "#E54065",
        "background": "#F4F5F9",
        "border": "#CFD2DC",
        "text": "#636363",
        "filter_btn": "#E1E4EA",
        "read_background": "#F2F2F2",
        "text-primary": "#7A7A7A",
      },
    },
    plugins: [],
  }
}

