export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.ENVIRONMENT === 'development' },
  ssr: true,
  modules: ['@nuxtjs/sitemap', '@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt', "pinia-plugin-persistedstate", '@nuxt/content', 'nuxt-gtag',/*'nuxt-nodemailer'*/],

  /*
  nodemailer: {
    from: '"Latin Panty" <support@latinpanty.com>',
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
      user: 'apikey',
      pass: process.env.SMTP_PASSWORD,
    },
  },*/

  site: {
    url: process.env.NUXT_SITE_URL ,
    name: process.env.NUXT_SITE_NAME 
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  gtag: {
    id: 'G-8EPNTJ52SL'
  },


  runtimeConfig: {
    // Server-side 
    /*SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,*/
    mail:process.env.MAIL,
    supabaseUrl: process.env.SUPABASE_URL,
    secretApiKey: process.env.SECRET_API_KEY,
    dev: process.env.ENVIRONMENT,
   /* smtpP: process.env.SMTP_P,*/
    // Public 
    public: {
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/register', '/login', '/ad/bogaloo', '/landing/vendedoras', '/contacto', '/landing/tienda', '/sitemap.xml', '/revista', '/revista/category/instagram', '/revista/category/onlyfans', '/revista/category/entrevistas', '/revista/entrevista-jessica-barranquillera',
        '/revista/mistica-entrevista-venta-panties', '/revista/entrevista-amorazz-onlyfans', '/revista/entrevista-catalina-ortiz-entrevista-gordibuena', '/revista/entrevista-sofymackkk-onlyfans', '/revista/entrevista-latina_chantel-una-latina-explosiva-con-cuenta-de-onlyfans-de-tampa',
        '/revista/antonia-chilena-onlyfans-entrevista'],
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
});