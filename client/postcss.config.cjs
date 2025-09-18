// postcss.config.cjs
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // Use the new plugin name
    autoprefixer: {}, // Keep autoprefixer
  },
};
