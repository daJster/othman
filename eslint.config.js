const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * Layering rules.
 *
 *   src/core       platform-agnostic. No React, no react-native, no expo, no
 *                  DOM, no Firebase. Compiled separately by tsconfig.core.json
 *                  (which drops `lib: ["DOM"]`), so DOM usage is *also* a
 *                  compile error. This layer must stay trivially portable.
 *
 *   src/platform   contracts + per-platform implementations. Consumers import
 *                  the barrel (`@/platform/storage`), never the concrete file,
 *                  so Metro picks the implementation at bundle time.
 *
 *   src/services   single implementation shared by every platform (the cloud
 *                  backend is identical everywhere).
 *
 *   src/providers  isomorphic React contexts.
 *
 *   src/ui, src/app  presentation. May import anything above it.
 */

const CORE_FORBIDDEN_IMPORTS = [
  {
    group: ['react', 'react/*', 'react/jsx-runtime'],
    message:
      'core/ is runtime-agnostic and must not import React. Put this in src/providers or src/app.',
  },
  {
    group: ['react-native', 'react-native/*', 'react-native-web'],
    message:
      'core/ is runtime-agnostic and must not import react-native. Add a contract under src/platform instead.',
  },
  {
    group: ['expo', 'expo/*', '@expo/*', '@expo/ui'],
    message:
      'core/ is runtime-agnostic and must not import expo. Add a contract under src/platform instead.',
  },
  {
    group: ['firebase', 'firebase/*'],
    message:
      'core/ must not import firebase. Expose a repository in src/services behind a platform-neutral type.',
  },
  {
    group: [
      '@/platform',
      '@/platform/*',
      '@/services',
      '@/services/*',
      '@/providers',
      '@/providers/*',
      '@/components',
      '@/components/*',
      '@/hooks',
      '@/hooks/*',
      '@/app',
      '@/app/*',
    ],
    message: 'core/ is the lowest layer and must not import from a higher layer.',
  },
];

const DOM_GLOBALS = [
  { name: 'window', message: 'No window in core/. Use a contract under src/platform.' },
  { name: 'document', message: 'No document in core/. Use a contract under src/platform.' },
  { name: 'localStorage', message: 'No localStorage in core/. Inject a StorageService.' },
  { name: 'sessionStorage', message: 'No sessionStorage in core/.' },
  { name: 'navigator', message: 'No navigator in core/.' },
  { name: 'location', message: 'No location in core/.' },
  { name: 'alert', message: 'No alert() in core/. Surface the error to the caller.' },
  { name: 'confirm', message: 'No confirm() in core/.' },
  { name: 'prompt', message: 'No prompt() in core/.' },
  { name: 'HTMLElement', message: 'No DOM types in core/.' },
  { name: 'HTMLImageElement', message: 'No DOM types in core/.' },
  { name: 'HTMLAudioElement', message: 'No DOM types in core/.' },
  { name: 'File', message: 'No DOM types in core/.' },
  { name: 'FileReader', message: 'No DOM types in core/.' },
  { name: 'Image', message: 'No DOM types in core/.' },
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      'web-build/**',
      '.expo/**',
      'expo-env.d.ts',
      'node_modules/**',
      // Frozen legacy Vite app, kept as a read-only reference for the port.
      'othman-web/**',
      'othman-mobile/**',
    ],
  },
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: CORE_FORBIDDEN_IMPORTS }],
      'no-restricted-globals': ['error', ...DOM_GLOBALS],
    },
  },
  {
    // Only the transport layer inside core/ may touch the network.
    files: ['src/core/**/*.{ts,tsx}'],
    ignores: ['src/core/http/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...DOM_GLOBALS,
        {
          name: 'fetch',
          message: 'Only src/core/http may call fetch. Route requests through the http client.',
        },
      ],
    },
  },
  {
    // Platform implementations and shared services may not reach into the UI.
    files: ['src/platform/**/*.{ts,tsx}', 'src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/components',
                '@/components/*',
                '@/app',
                '@/app/*',
                '@/providers',
                '@/providers/*',
                '@/ui',
                '@/ui/*',
              ],
              message: 'platform/ and services/ sit below the UI layer.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // The pre-migration Firebase barrel must not creep back in.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/firebase', '@/firebase/*'],
              message:
                'The old @/firebase barrel is gone. Use @/services/firebase or @/platform/auth.',
            },
          ],
        },
      ],
    },
  },
]);