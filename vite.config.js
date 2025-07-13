import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            },
            '/ws': {
                target: process.env.VITE_WS_URL || 'ws://localhost:8000',
                ws: true,
                changeOrigin: true
            },
            '/recordings': {
                target: process.env.VITE_API_URL || 'http://localhost:8000',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['axios', 'clsx'],
                    ui: ['lucide-react', 'react-hot-toast'],
                    store: ['zustand']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    preview: {
        host: '0.0.0.0',
        port: 5173
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'zustand', 'axios', 'clsx']
    }
})