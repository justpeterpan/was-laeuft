// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@vueuse/nuxt', '@nuxt/ui', '@nuxthub/core'],
  runtimeConfig: {
    lastfm: process.env.LASTFM || '',
    public: {
      init: process.env.INIT || '20240701',
    },
  },
  hub: {
    blob: true,
    remote: true,
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
      meta: [
        {
          property: 'og:description',
          content: 'Guess the Song based on bass, drums, vocals & instruments ',
        },
      ],
    },
  },
  future: {
    compatibilityVersion: 4,
  },
})
