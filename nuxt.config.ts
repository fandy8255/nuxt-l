export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.ENVIRONMENT === 'development' },
  ssr: true,
  modules: ['@nuxtjs/sitemap', '@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt', "pinia-plugin-persistedstate", '@nuxt/content', 'nuxt-gtag'],


  site: {
    url: process.env.NUXT_SITE_URL,
    name: process.env.NUXT_SITE_NAME
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  gtag: {
    id: 'G-8EPNTJ52SL'
  },


  runtimeConfig: {

    mail: process.env.MAIL,
    supabaseUrl: process.env.SUPABASE_URL,
    secretApiKey: process.env.SECRET_API_KEY,
    dev: process.env.ENVIRONMENT,

    public: {
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/',
        '/register',
        '/login',
        '/ad/bogaloo',
        '/landing/vendedoras',
        '/contacto',
        '/landing/tienda',
        '/sitemap.xml',
        '/revista',
        '/revista/category/instagram',
        '/revista/category/onlyfans',
        '/revista/category/entrevistas',
        '/revista/articulos/entrevista-camila-torres',
        '/revista/articulos/entrevista-catalina-ortiz-entrevista-gordibuena',
        '/revista/articulos/elisabeth-escalante-colombiana-mamasita-entrevista',
        '/revista/articulos/entrevista-gabriela-mendez',
        "/revista/articulo/entrevista-isabella-cruz",
        '/revista/articulos/camila-torres',
        '/revista/articulos/entrevista-giselle-flores',
        '/revista/articulos/entrevista-martina-reyes',
        '/revista/articulos/valeria-rios-entrevista',
        '/revista/articulos/que-es-el-fetiche-de-pies',
        '/revista/articulos/que-es-el-fetiche-de-manos',
        '/revista/articulos/que-es-el-fetiche-de-axilas',
        '/revista/articulos/que-es-el-fetiche-de-cosquillas',
        '/revista/articulos/que-es-el-fetiche-de-zapatos',
        '/revista/etiquetas/entrevistas',
        '/revista/etiquetas/colombianas-amateur-naturales',
        '/revista/etiquetas//panties-usados-colombia',
        '/revista/etiquetas/tangas-usadas',
        '/revista/etiquetas/calzones-usados',
        '/revista/etiquetas/colombianas-hermosas',
        '/revista/etiquetas/caleñas-hermosas',
        '/revista/etiquetas/tangas-usadas-colombia',
        '/revista/etiquetas/chilenas-hermosas',
        '/revista/etiquetas/panties-usados',
        '/revista/etiquetas/bragas-usadas',
        '/revista/etiquetas/argentinas-amateur-naturales',
        '/revista/etiquetas/argentinas-hermosas',
        '/revista/etiquetas/panties-usados-argentina',
        '/revista/etiquetas/bragas-usadas-argentina',
        '/revista/etiquetas/uruguayas-amateur',
        '/revista/etiquetas/panties-usados-uruguay',
        '/revista/etiquetas/bragas-usadas-uruguay',
        '/revista/etiquetas/argentinas-amateur',
        '/revista/etiquetas/argentinas-tetonas',
        '/revista/etiquetas/tetonas',
        '/revista/etiquetas/latinas-tetonas',
        '/revista/etiquetas/mexicanas-amateur',
        '/revista/etiquetas/panties-usados-mexico',
        '/revista/etiquetas/bragas-usadas-mexico',
        '/revista/etiquetas/mujeres-chilenas',
        '/revista/etiquetas/amateur',
        '/revista/etiquetas/latinas',
        '/revista/etiquetas/entrevista',
        '/revista/etiquetas/chilenas',
        '/revista/etiquetas/onlyfans',
        '/revista/etiquetas/peludas',
        '/revista/etiquetas/chicas-tatuajes',
        '/revista/etiquetas/colombianas',
        '/revista/etiquetas/fetiches',
        '/revista/etiquetas/onlyfans-latinas',
        '/revista/etiquetas/mexicanas',
        '/revista/etiquetas/gordita',
        '/revista/etiquetas/gordibuena',
        '/revista/etiquetas/voluptuosas',
        '/revista/etiquetas/latinas-onlyfans',
        '/revista/etiquetas/tatuajes',
        '/revista/etiquetas/latinas-instagram',
        '/revista/etiquetas/piercings',
        '/revista/etiquetas/latinas-culonas',
        '/revista/etiquetas/buttplug',
        '/revista/etiquetas/barranquilleras',
        '/revista/etiquetas/latina'
      ],
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