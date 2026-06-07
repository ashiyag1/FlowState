import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false, // keep using our custom manifest in public/
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp}'],
          maximumFileSizeToCacheInBytes: 3000000,
          runtimeCaching: [
            {
              urlPattern: /^\/api\/v1\/.*/,
              handler: 'StaleWhileRevalidate',
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache background audio tracks (Sound Sanctuary / Sadhana Player)
              urlPattern: /.*\.(?:mp3|wav|ogg)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'audio-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache Google Fonts stylesheets
              urlPattern: /^https:\/\/fonts\.googleapis\.com/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets'
              }
            },
            {
              // Cache Google Fonts files
              urlPattern: /^https:\/\/fonts\.gstatic\.com/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfiles',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],

    build: {
      // Target modern browsers for smaller, faster output
      target: 'esnext',

      // Remove console.log/console.warn in production builds
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },

      // Split CSS per chunk (default true, but explicit for clarity)
      cssCodeSplit: true,

      // Raise the chunk size warning threshold (audio assets are large)
      chunkSizeWarningLimit: 800,

      rollupOptions: {
        output: {
          // Split vendor code into named chunks for better browser caching
          manualChunks: {
            'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
            'vendor-framer': ['framer-motion'],
            'vendor-icons':  ['lucide-react'],
          },
        },
      },
    },

    // Pre-bundle heavy deps so dev startup is instant instead of lazy-loading them
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'lucide-react',
      ],
    },

    server: {
      host: '0.0.0.0', // Listen on all local IPs so testing on phone over LAN works
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  }
})