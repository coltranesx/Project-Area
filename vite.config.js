import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Project-Area/", // BU SATIRIN DOĞRU OLDUĞUNDAN %100 EMİN OLUN
})
