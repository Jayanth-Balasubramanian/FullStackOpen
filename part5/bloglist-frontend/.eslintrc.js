module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
    'cypress/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react', 'jest', 'cypress',
  ],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': 0,
    'no-alert': 0,
    'prefer-arrow-callback': 0,
  },
};
