// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxt/ui'],
  runtimeConfig: {
    lastfm: process.env.LASTFM || '',
    public: {
      bucket: process.env.PUBLIC_BUCKET || '',
    },
  },
  ui: {
    notifications: {
      position: 'bottom-0 top-auto left-0 right-auto',
    },
  },
  tailwindcss: {
    config: {
      plugins: [require('tailwindcss-animated')],
    },
  },
})
