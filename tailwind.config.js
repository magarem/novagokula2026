/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  // ADICIONE ISTO AQUI:
  safelist: [
    // Obriga o Tailwind a gerar grid-cols de 1 a 12
    {
      pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/,
      variants: ['md', 'lg', 'xl'], // Gera versões responsivas
    },
    // Obriga o Tailwind a gerar col-span de 1 a 12
    {
      pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12|full)/,
      variants: ['md', 'lg', 'xl'], // Gera versões responsivas
    }
  ],
}