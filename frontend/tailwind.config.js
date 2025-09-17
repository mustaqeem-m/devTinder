/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui';
import 'daisyui/theme/object';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: ['night'],
  },
};
