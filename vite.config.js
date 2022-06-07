import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import path from 'path';
import { defineConfig } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';
import { injectHtml } from 'vite-plugin-html';

const platform = process.argv.platform || 'web'
const isElectron = () => platform === 'electron'

const root = __dirname

const target = isElectron() ? 'electron-renderer' : 'web'
const outDir = isElectron() ? 'web/' : '../electron/www/'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  outDir: path.resolve(root, outDir),
  publicDir: 'src/client/resources',
  define: {
    PLATFORM: JSON.stringify(platform)
  },
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: ''
      },
      {
        find: '@',
        replacement: path.resolve(root, 'src')
      },
      {
        find: 'platform',
        replacement: path.resolve(root, `./src/client/platform/${platform}`)
      }
    ],
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue'
    ]
  },
  plugins: [
    viteCommonjs(),
    envCompatible(),
    injectHtml()
  ],
  build: {}
})
