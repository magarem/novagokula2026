import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";
import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config

// CONSTANTE PARA O CAMINHO ABSOLUTO
// Isso garante que tanto o driver 'content' quanto o driver interno do Nuxt usem a mesma pasta
const CONTENT_PATH = '/Users/marceloamagalhaes/desenv/apps/storage/novagokula/content';

export default defineNuxtConfig({
  runtimeConfig: {
    // 1. Chaves Privadas (Server-side)
    storagePath: process.env.STORAGE_PATH,
    jwtSecret: process.env.JWT_SECRET || 'chave-secreta-padrao',

    // 2. Chaves Públicas (Client-side)
    public: {
      siteName: 'novagokula',
      uploadPath: process.env.NUXT_PUBLIC_UPLOAD_PATH || 'public/images'
    }
  },

 nitro: {
    preset: 'node-server',          // ideal pro seu VPS (roda com node .output/server/index.mjs)
    
    // Ativa cache persistente no filesystem (importante no VPS!)
    storage: {
      cache: {
        driver: 'fs',
        base: './.data/cache'         // pasta que persiste entre restarts
      }
    }
  },

  routeRules: {
    // Páginas fixas → gera no build e serve estaticamente pra sempre
    '/':                        { prerender: true },

    // Todo o conteúdo dinâmico do @nuxt/content → SWR com TTL razoável
    // Serve cache → regenera em background quando expirar
    '/**':                      { swr: 600 },     // 10 minutos (muito bom pra começar)
    // Exemplos mais específicos (ajuste conforme seu site):
    // '/blog/**':              { swr: 3600 },   // 1 hora
    // '/eventos/**':           { swr: 1800 },   // 30 min
    // '/kirtans/**':           { swr: true },   // SWR sem TTL fixo (até próximo restart)

    // Áreas admin / preview / API → sempre fresco, sem cache
    '/admin/**':                { ssr: true, cache: false },
    '/api/**':                  { cache: false },
    '/preview/**':              { ssr: true, cache: false }
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