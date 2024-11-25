/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  plugins: [require('tailwindcss-motion')],
  corePlugins: {
    preflight: false,
  }
}

