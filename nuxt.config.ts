// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt', "pinia-plugin-persistedstate"],
  runtimeConfig: {
    public: {
      baseUrl: process.env.SUPABASE_URL || 'http://localhost:3000',
      secretApiKey:process.env.SECRET_API_KEY,
      dev:process.env.ENVIRONMENT
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register', '/login', '/ad/bogaloo' ],
    }
  },

  image: {
    bunny: {
      baseURL: "https://lingerie.b-cdn.net",
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ""
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet',
          rel: 'stylesheet'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
          integrity: 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==',
          crossorigin: 'anonymous',
          referrerpolicy: "no-referrer"
        }

      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          tagPosition: 'bodyClose'
        },
      ]
    }
  },


})