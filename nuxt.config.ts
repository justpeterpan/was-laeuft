// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@vueuse/nuxt', '@nuxt/ui'],
  runtimeConfig: {
    lastfm: process.env.LASTFM || '',
    public: {
      bucket: process.env.PUBLIC_BUCKET || '',
      init: process.env.INIT || '20240524',
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
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Guess the Song ♫',
    },
  },
})
