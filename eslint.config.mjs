import globals from 'globals';

export default [
  {
    files: ['data.js', 'assets/js/**/*.js', 'tests/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        cafesData: 'readonly',
        mallsData: 'readonly',
        restaurantsData: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none' }]
    }
  },
  {
    files: ['data.js', 'assets/js/**/*.js'],
    languageOptions: {
      sourceType: 'script'
    }
  },
  {
    files: ['api/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    }
  },
  {
    files: ['tests/**/*.mjs'],
    languageOptions: {
      globals: globals.node
    }
  }
];
