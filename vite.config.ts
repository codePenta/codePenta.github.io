import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'dist',
        sourcemap: true,
        emptyOutDir: true
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