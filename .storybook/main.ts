import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    return mergeConfig(config, {
      base: process.env.STORYBOOK_BASE_PATH || './',
      build: { target: 'esnext' },
      define: { global: 'globalThis' },
      resolve: {
        alias: [{ find: /^react-native$/, replacement: 'react-native-web' }],
        extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
    });
  },
};

export default config;
