import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";
import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config

// CONSTANTE PARA O CAMINHO ABSOLUTO
// Isso garante que tanto o driver 'content' quanto o driver interno do Nuxt usem a mesma pasta

export default defineNuxtConfig({
  runtimeConfig: {
    // 1. Chaves Privadas (Server-side)
    storagePath: process.env.STORAGE_PATH,
    jwtSecret: process.env.JWT_SECRET || 'chave-secreta-padrao',
    siteId: process.env.NUXT_SITE_ID || '',
    // 2. Chaves Públicas (Client-side)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      siteName: 'novagokula',
      uploadPath: process.env.NUXT_PUBLIC_UPLOAD_PATH || 'public/images'
    }
  },

  // Ajuda a extrair payloads e reduzir tamanho
  experimental: {
    payloadExtraction: true
  },


  css: [
    'primeicons/primeicons.css',
    './app/assets/css/main.css', 
    '@fortawesome/fontawesome-free/css/all.css'
  ],  
  modules: [
    '@nuxt/content',
    '@primevue/nuxt-module',
    '@nuxtjs/seo'
  ],

 // --- CONFIGURAÇÃO GLOBAL DO SITE (A Fonte da Verdade) ---
  site: {
    url: 'https://www.novagokula.com.br',
    name: 'Nova Gokula',
    description: 'A maior comunidade rural Hare Krishna da América Latina.',
    defaultLocale: 'pt-BR', // Importante para o Google saber o idioma
    indexable: true, // Em produção é true, em dev/staging pode ser false
  },
  robots: {
    // Garante que o sitemap esteja listado no robots.txt
    sitemap: '/sitemap.xml' 
  },

  // Ativa o inspector para você debugar SEO em desenvolvimento
  devtools: { enabled: true },
  
  primevue: {
      options: {
          theme: {
              preset: Aura
          }
      }
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})