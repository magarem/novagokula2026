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


  css: ['./app/assets/css/main.css', '@fortawesome/fontawesome-free/css/all.css'],
  
  modules: [
    '@nuxt/content',
    '@primevue/nuxt-module'
  ],
  
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