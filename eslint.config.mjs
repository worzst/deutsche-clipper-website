import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    // `interface Props {}` is idiomatic Astro — empty interfaces are intentional
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^Props$' }],
    },
  },
  {
    ignores: ['dist/', '.astro/'],
  },
];
