import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // split vendor libs into a separate chunk so they're cached separately
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom'))      return 'react-dom';
            if (id.includes('react-router'))   return 'react-router';
            if (id.includes('redux'))          return 'redux';
            if (id.includes('socket.io'))      return 'socket-io';
            if (id.includes('axios'))          return 'axios';
            // heavy 3D libs — split individually so they don't bloat vendor
            if (id.includes('three'))          return 'three';
            if (id.includes('postprocessing')) return 'postprocessing';
            if (id.includes('ogl'))            return 'ogl';
            return 'vendor';
          }
        },
      },
    },
    // enable CSS code splitting — each chunk gets its own CSS file
    cssCodeSplit: true,
    // generate source maps for production debugging (set false to disable)
    sourcemap: false,
    // warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 700,
  },
})
