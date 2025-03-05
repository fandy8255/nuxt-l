export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.ENVIRONMENT === 'development' },
  ssr: true,
  modules: ['@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt', "pinia-plugin-persistedstate", '@nuxt/content'],

  runtimeConfig: {
    // Server-side only
    supabaseUrl: process.env.SUPABASE_URL,
    secretApiKey: process.env.SECRET_API_KEY,
    dev: process.env.ENVIRONMENT,
    // Public (client-side accessible)
    public: {
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register', '/login', '/ad/bogaloo', '/landing/vendedoras', '/landing/tienda', '/revista', '/revista/category/instagram', '/revista/category/onlyfans', '/revista/article',
        '/revista/article2', '/revista/article3', '/revista/article4', '/revista/article5', '/revista/article6'],
    }
  },

  routeRules: {
    '/dashboard': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/mensajes': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/mensajes/**': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/perfil/**': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/user': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/tienda': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/tienda/**': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/usuarios': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/feed': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/mensajes/user/**': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/mensajes/**': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/bogaloo': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/cntProducts': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/cntThreads': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/cntUsers': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/products': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/threads': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/ad/users': { headers: { 'X-Robots-Tag': 'noindex' } },
    '/': { headers: { 'X-Robots-Tag': 'index, follow' } }, // Home page
    '/magazine': { headers: { 'X-Robots-Tag': 'index, follow' } }, // Magazine page
    '/landing': { headers: { 'X-Robots-Tag': 'index, follow' } }
  },

  image: {
    bunny: {
      baseURL: "baseurl",
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
});