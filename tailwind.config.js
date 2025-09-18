/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lummy': {
          'light': '#FAFAFA',
          'blue': '#2563EB',
          'pink': '#FF66B3',
          'orange': '#FF8D15',
          'green': '#62C370',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
