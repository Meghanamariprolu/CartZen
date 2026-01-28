module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
