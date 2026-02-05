<template>
  <header
    v-if="settings?.data?.topbar"
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="{
      'bg-orange-300 backdrop-blur-md': !scrolled,   
      'bg-orange-300/95 shadow-lg backdrop-blur-sm': scrolled   
    }"
    :style="{ color: mainColor }"
  >
    <div class="flex justify-between items-center py-3 px-5 md:px-0 max-w-7xl mx-auto">
      
      <NuxtLink to="/" class="group flex flex-col items-center no-underline z-50">
        <span class="transition-all duration-500">
          <img 
            v-if="settings.data.topbar.logo?.img" 
            :src="settings.data.topbar.logo.img" 
            alt="Logo" 
            class="h-10 h-[78px] object-contain pb-2"
          > 
        </span>
      </NuxtLink>

      <nav class="hidden lg:flex items-center space-x-6">
        <template v-for="(item, index) in settings.data.topbar.menu" :key="index">
          
          <div v-if="item.sub && item.sub.length > 0" class="relative group/dropdown py-4">
            <button 
              class="flex items-center text-[20px] font-serif font-medium hover:opacity-70 transition-opacity gap-1"
              :style="{ color: mainColor }"
            >
              {{ item.name }}
              <i class="fas fa-chevron-down text-xs opacity-70 mt-1"></i>
            </button>
            <div class="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform origin-top">
              <div class="bg-[#fdfcf0] rounded shadow-xl border border-[#d1b253]/20 py-2 min-w-[220px] overflow-hidden">
                <NuxtLink
                  v-for="(subItem, subIndex) in item.sub"
                  :key="subIndex"
                  :to="resolveLink(subItem.link)"
                  class="block px-6 py-2 text-lg font-serif text-[#431407] hover:bg-[#f9d7c0]/30 hover:pl-8 transition-all duration-200"
                >
                  {{ subItem.name }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <NuxtLink
            v-else-if="item.type === 'button'"
            :to="resolveLink(item.link)"
            class="px-6 py-2 rounded-full font-serif font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            :style="{ backgroundColor: mainColor }"
          >
            {{ item.name }}
          </NuxtLink>

          <NuxtLink
            v-else
            :to="resolveLink(item.link)"
            class="relative text-[20px] font-serif font-medium tracking-tight group/link"
          >
            {{ item.name }}
            <span 
              class="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 opacity-40 group-hover/link:w-full"
              :style="{ backgroundColor: mainColor }"
            ></span>
          </NuxtLink>

        </template>
      </nav>

      <div class="lg:hidden relative z-50">
        <button
          @click="toggleMenu"
          class="focus:outline-none transition-transform duration-300"
          :class="{ 'rotate-90': menuOpen }"
          style="color: inherit;" 
        >
          <i v-if="!menuOpen" class="fas fa-bars text-2xl"></i>
          <i v-else class="fas fa-times text-2xl"></i>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div 
        class="fixed inset-0 bg-[#f9d7c0] z-40 flex flex-col pt-24 px-6 overflow-y-auto transition-transform duration-500 lg:hidden"
        :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
      >
      
        <div class="flex flex-col space-y-4 pb-10">
          <template v-for="(item, index) in settings.data.topbar.menu" :key="index">
            
            <div v-if="item.sub" class="border-b border-[#431407]/10 pb-2">
              <button 
                @click="toggleMobileSubmenu(index)"
                class="flex justify-between items-center w-full text-xl font-serif font-bold text-[#431407]"
              >
                {{ item.name }}
                <i class="fas fa-chevron-down text-sm transition-transform" :class="{'rotate-180': activeMobileSubmenu === index}"></i>
              </button>
              
              <div v-show="activeMobileSubmenu === index" class="pl-4 mt-2 flex flex-col space-y-2 border-l-2 border-[#431407]/20">
                 <NuxtLink
                    v-for="(subItem, subIndex) in item.sub"
                    :key="subIndex"
                    :to="resolveLink(subItem.link)"
                    class="text-[#431407] font-serif py-1 hover:text-opacity-70"
                    @click="menuOpen = false"
                  >
                    {{ subItem.name }}
                  </NuxtLink>
              </div>
            </div>

            <NuxtLink
              v-else-if="item.type === 'button'"
              :to="resolveLink(item.link)"
              class="text-center py-3 rounded text-white font-bold text-xl shadow-sm"
              :style="{ backgroundColor: mainColor }"
              @click="menuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>

            <NuxtLink
              v-else
              :to="resolveLink(item.link)"
              class="text-xl font-serif font-bold text-[#431407] border-b border-[#431407]/10 pb-2"
              @click="menuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>

          </template>
        </div>
      </div>
    </Teleport>

  </header>
</template>

<script setup lang="ts">
// (O seu script pode continuar exatamente igual, não precisa mudar nada nele)
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from 'vue'

const mainColor = '#431407'
const menuOpen = ref(false)
const scrolled = ref(false)
const activeMobileSubmenu = ref<number | null>(null)


const { data: settings } = await useFetch(`/api/page/settings`, {
    lazy: true,
    server: false,
})

watchEffect(() => {
  if (!settings.value) {
    console.warn("Aviso: settings.md não encontrado ou vazio.")
  }
})

const topbar = computed(() => {
  // 1. Tenta pegar direto da raiz (Padrão novo do useSmartContent)
  if (settings.value?.topbar) return settings.value.topbar
  
  // 2. Tenta pegar de 'meta' (caso o frontmatter esteja aninhado)
  if (settings.value?.data?.topbar) return settings.value.data.topbar
  
  // 3. Fallback se não encontrar nada
  return {
    logo: { img: '', link: '/' },
    menu: []
  }
})

const resolveLink = (link: string) => {
  if (!link) return '#'
  let cleanLink = link.replace(/:/g, '/').replace('_index', '').replace('.md', '')
  if (!cleanLink.startsWith('/') && !cleanLink.startsWith('http')) cleanLink = '/' + cleanLink
  if (cleanLink.length > 1 && cleanLink.endsWith('/')) cleanLink = cleanLink.slice(0, -1)
  return cleanLink
}

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const toggleMobileSubmenu = (index: number) => {
  activeMobileSubmenu.value = activeMobileSubmenu.value === index ? null : index
}

const onScroll = () => { scrolled.value = window.scrollY > 50 }

onMounted(() => { window.addEventListener('scroll', onScroll) })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll) })
</script>