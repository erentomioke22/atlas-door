// const config = {
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;
// import tailwindcss from '@tailwindcss/postcss'
// import autoprefixer from 'autoprefixer'

// export default {
//   plugins: [
//     tailwindcss,
//     autoprefixer,
//   ],
// }

/** @type {import('postcss').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    // 'autoprefixer': {},
  },
};

export default config;