import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    // tailwindcss()
  ],
  resolve: {
    alias: {
      "~api": path.resolve(__dirname, "src/api"),
      "~elements": path.resolve(__dirname, "src/components/elements"),
      "~fieldset/fields": path.resolve(__dirname, "src/components/elements/Fieldset/fields"),
      "~pages": path.resolve(__dirname, "src/pages"),
      "~pages/content": path.resolve(__dirname, "src/pages/content"),
      "~pages/schema": path.resolve(__dirname, "src/pages/schema"),
      "~utils": path.resolve(__dirname, "src/utils"),
      "~helpers": path.resolve(__dirname, "src/helpers"),
      "~hooks": path.resolve(__dirname, "src/hooks"),
      "~hooks/content": path.resolve(__dirname, "src/hooks/content"),
      "~hooks/schema": path.resolve(__dirname, "src/hooks/schema"),
      "~hooks/shared": path.resolve(__dirname, "src/hooks/shared"),
      "~modules/schema": path.resolve(__dirname, "src/components/modules/schema"),
      "~modules/content": path.resolve(__dirname, "src/components/modules/content"),
      "~modules/layout": path.resolve(__dirname, "src/components/modules/layout"),
      "~services": path.resolve(__dirname, "src/services")
    },
  },
})
