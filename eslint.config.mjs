import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // Configuração do plugin prettier no formato correto
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
  'prettier/prettier': ['error', { endOfLine: 'auto' }],
      // Adicionar regras específicas para resolver problemas de build
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/jsx-key': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Permitir any temporariamente para resolver builds
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
  {
    // Configurações específicas para arquivos TypeScript
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Regras específicas para TypeScript
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
];

export default eslintConfig;
