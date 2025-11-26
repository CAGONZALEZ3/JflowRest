import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración Vite para React + Socket.io + Leaflet
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // 👈 Corrige el error "global is not defined"
  },
});
