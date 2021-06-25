module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['react', 'react-hooks'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    // 'react/prop-types': 0,
    'react-native/no-inline-styles': 'off',
    // 'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // 'max-len': ['error', {code: 120}],
  },
};
