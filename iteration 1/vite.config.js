import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET || 'http://13.236.162.216:8080'
  
  // Set base path for production to match deployed subpath
  const base = process.env.NODE_ENV === 'production' ? '/iteration1/' : '/main_tp40/'
  
  return {
    base: base,
    plugins: [vue()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Local development proxy to solve CORS. Frontend requests /api/* will be forwarded to backend.
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
})

