<template>
  <section class="w-full bg-[#f5d1ab] py-6 shadow-md _border-b-4 border-[#f2d9bd] mt-0">
    <div class="max-w-7xl mx-auto px-4">
      
      <div class="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 justify-center items-start">
        
        <NuxtLink 
          v-for="(item, index) in items" 
          :key="index"
          :to="item.link"
          class="group flex flex-col items-center text-center no-underline cursor-pointer transition-transform duration-300 hover:-translate-y-1"
        >
          <div class="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-[#d8ae65] text-[#77491b] shadow-md group-hover:bg-[#d97706] group-hover:text-white transition-all duration-300">
            <i :class="[item.icon, 'text-lg transition-colors']"></i>
          </div>

          <h3 class="text-black font-serif _uppercase tracking-wider font-bold text-[9px] sm:text-[10px] md:text-[15px] _group-hover:text-[#fae9d7] transition-colors whitespace-nowrap drop-shadow-sm">
            {{ item.label }}
          </h3>

          <!-- <p class="hidden lg:block text-black text-[9px] mt-0.5 font-sans font-medium leading-tight">
            {{ item.desc }}
          </p> -->
        </NuxtLink>

      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  source: { type: String, default: null },
  data: { type: [Array, Object], default: null }
});

const route = useRoute();

// --- 1. DETECTA PREVIEW E ENDPOINT ---
const isPreview = computed(() => {
  return route.query.preview === 'true' || (import.meta.client && window.location.hostname.startsWith('preview.'));
});

// Calcula a URL do arquivo de configuração (o .toml)
const sourceEndpoint = computed(() => {
  if (!props.source) return null;
  const cleanPath = props.source.replace(/^\//, '').replace(/\.md$/, '').replace(/\.toml$/, '');
  return isPreview.value ? `/api/preview/${cleanPath}` : `/api/page/${cleanPath}`;
});

// --- 2. FETCH DA CONFIGURAÇÃO (O arquivo TOML) ---
const { data: configData } = await useFetch(sourceEndpoint, {
  key: `quick-access-config-${props.source}`,
  immediate: !!props.source,
  watch: [sourceEndpoint]
});

// --- 3. FETCH DO CONTEÚDO DINÂMICO (Se tiver "section" no TOML) ---
// Usamos useAsyncData para buscar os eventos/paginas se o config mandar
const { data: dynamicItems } = await useAsyncData(
  `quick-access-items-${props.source}`,
  async () => {
    const rawConfig = configData.value?.data || configData.value || {};
    
    // Se o TOML tiver a chave "section" (ex: "content/eventos")
    if (rawConfig.section) {
      let queryPath = rawConfig.section;
      if (queryPath.startsWith('content/')) queryPath = queryPath.replace('content/', '');

      // Busca no Nuxt Content
      let query = queryContent(queryPath)
        .where({ _extension: 'md' }) // Pega apenas markdowns
        .sort({ date: -1 });         // Ordena por data (opcional)
        
      if (rawConfig.limit) {
        query = query.limit(rawConfig.limit);
      }

      const results = await query.find();

      // Mapeia os eventos para o formato do QuickAccessBar
      return results.map(item => ({
        label: item.title,
        // Usa a imagem de capa como ícone, ou um ícone padrão
        icon: item.cover || item.image || item.icon || 'fas fa-calendar-alt', 
        link: item._path,
        desc: item.description,
        isImage: !!(item.cover || item.image) // Flag para saber se renderiza img ou i
      }));
    }
    return [];
  },
  { 
    watch: [configData] // Re-executa se o config mudar
  }
);

// --- 4. COMPUTED FINAL ---
// Decide se usa os itens dinâmicos, os manuais do TOML ou o Fallback
const items = computed(() => {
  // A. Se buscamos itens dinâmicos (Eventos, Notícias...)
  if (dynamicItems.value && dynamicItems.value.length > 0) {
    return dynamicItems.value;
  }

  const raw = configData.value?.data || configData.value || {};

  // B. Se o TOML tiver uma lista manual (items = [...])
  if (raw.items && Array.isArray(raw.items)) return raw.items;

  // C. Fallback (Padrão)
  return [
    { label: 'Templos', icon: 'fas fa-gopuram', link: '/atrativos/templos' },
    { label: 'Hospedagem', icon: 'fas fa-bed', link: '/atrativos/hospedagem' },
    { label: 'Alimentação', icon: 'fas fa-utensils', link: '/atrativos/alimentacao' },
    { label: 'Eventos', icon: 'fas fa-calendar-day', link: '/eventos' },
    { label: 'Atrativos', icon: 'fas fa-tree', link: '/atrativos/conheca-a-fazenda' },
    { label: 'Contato', icon: 'fas fa-envelope', link: '/contact' }
  ];
});

// Helper para tratar URL de imagem
const resolveIconUrl = (iconPath) => {
    if (!iconPath) return '';
    if (iconPath.startsWith('http') || iconPath.startsWith('/')) return iconPath;
    return `/assets/${iconPath}`; // Ajuste conforme sua estrutura de assets
};
</script>
