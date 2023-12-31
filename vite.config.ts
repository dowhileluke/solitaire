import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // devOptions: { enabled: true },
      // includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'faces/*.png'],
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Solitaire',
        short_name: 'Solitaire',
        description: 'A collection of solitaire card games',
        theme_color: 'firebrick',
        background_color: 'linen',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ],
      },
    })
  ],
  base: '/solitaire/',
  server: {
    host: true,
  },
})
