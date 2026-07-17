import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.expo/**',
      '.roo/**',
      '.venv/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      '*.cjs',
      'jest.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': ['error', { allowEmptyCatch: false }],
    },
  },
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*', 'expo', 'react', 'react-native', '@supabase/*'],
              message:
                'The domain must remain framework and infrastructure independent.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/{application,presentation}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Network calls belong in an infrastructure adapter.',
        },
      ],
    },
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@supabase/supabase-js',
              message: 'Use an application port and an infrastructure adapter instead.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
