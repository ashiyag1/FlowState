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
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^\/api\/v1\/.*/,
              handler: 'StaleWhileRevalidate',
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