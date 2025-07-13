import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'index.html'
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