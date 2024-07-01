import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(( {command} ) => ({
    base: command === 'build' ? '/ui/dist' : undefined,
    define: {
        global: 'window'
    },
    build: {
        sourcemap: false
    },
    optimizeDeps: {
        esbuildOptions: {
            mainFields: ['module', 'main'],
            resolveExtensions: ['.js', '.jsx']
        }
    },
    server: {
        port: 3000,
        open: true
    },
    plugins: [react()],
}));
