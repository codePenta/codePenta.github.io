import { defineConfig } from 'vite'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/codepenta.github.io/'
    : '/'

export default defineConfig({
    base: BASE_URL,
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: '/index.html'
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    server: {
        port: 5173,
        open: true,
        watch: {
            usePolling: true
        }
    },
})