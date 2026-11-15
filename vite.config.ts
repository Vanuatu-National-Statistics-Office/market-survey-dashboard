import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: ['VBoS_logo.png'],

      manifest: {
        name: 'Port Vila Central Market Survey',
        short_name: 'Market Survey',
        description:
          'Port Vila Central Market Survey Dashboard by the Vanuatu Bureau of Statistics',

        theme_color: '#176b78',
        background_color: '#0b2029',

        display: 'standalone',
        orientation: 'portrait-primary',

        start_url: '.',
        scope: '.',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,pdf,xlsx}'],
      },
    }),
  ],
})