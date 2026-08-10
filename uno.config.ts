import { defineConfig, presetWind3, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),      // Tailwind-compatible utility classes
    presetAttributify(), // optional: allows attribute-style classes
    presetIcons(),       // optional: enables icon classes like i-lucide-ticket
  ],
})