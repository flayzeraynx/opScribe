import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Set base to './' for GoDaddy subdirectory deployment
  // This ensures assets load correctly when hosted at example.com/recorder/
  base: './',
})
