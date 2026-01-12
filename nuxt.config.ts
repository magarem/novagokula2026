import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
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
  css: ['./app/assets/css/main.css', '@fortawesome/fontawesome-free/css/all.css'],
  modules: [
    '@nuxt/content','@primevue/nuxt-module'
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
