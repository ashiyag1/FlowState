import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [react()],

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
      host: false,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  }
})