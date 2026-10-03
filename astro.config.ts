import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://blog.samu9nai.workers.dev',
  vite: {
    plugins: [tailwindcss()]
  }
})
