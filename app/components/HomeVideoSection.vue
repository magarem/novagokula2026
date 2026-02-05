<script setup>
import { computed } from 'vue';

// 1. Props (Opcionais para override manual)
const props = defineProps({
  data: { type: Object, default: null },
  doc: { type: Object, default: null }
});

const route = useRoute();

// --- LÓGICA DE FETCH INTERNA ---

// 2. Determina dinamicamente o prefixo da API
const apiPrefix = computed(() => {
  const isPreview = route.query.preview !== undefined && route.query.preview !== 'false';
  return isPreview ? '/api/preview' : '/api/page';
});

// 3. Configurações do Fetch
const fetchOptions = {
  lazy: true,
  server: false,
  query: { t: Date.now() },
  watch: [apiPrefix]
};

// 4. A busca dos dados (Encaixado conforme solicitado)
// Nota: Se você mudou a pasta para '_home', verifique se o path aqui deve ser '/_home/bemvindo' ou '/home/bemvindo'
const { data: bemvindo } = await useFetch(
  () => `${apiPrefix.value}/_home/bemvindo`, 
  fetchOptions
);

// --- UNIFICAÇÃO DOS DADOS ---

// Computed que decide: Usa a prop 'doc' se existir, senão usa 'bemvindo'
const finalDoc = computed(() => props.doc || bemvindo.value);

// Computed que decide: Usa a prop 'data' se existir, senão usa 'bemvindo.data'
const finalData = computed(() => {
  if (props.data) return props.data;
  
  // Tenta pegar .data (padrão API) ou o objeto direto
  return bemvindo.value?.data || bemvindo.value || {};
});

// --- LÓGICA DE APRESENTAÇÃO ---

const embedUrl = computed(() => {
  const url = finalData.value?.videoUrl;
  if (!url) return '';
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
});
</script>

<template>
  <section v-if="finalData" class="_bg-[#919749] text-white">
    <div class="w-full p-8 md:p-10 bg-[#919749] max-w-screen-xl mx-auto h-auto md:min-h-[400px] relative overflow-hidden md:rounded-2xl shadow-lg">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        
         <div class="w-full">
          <div v-if="embedUrl" class="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl border-4 border-white/10">
            <iframe 
              :src="embedUrl" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full"
              loading="lazy"
            ></iframe>
          </div>
          <div v-else class="w-full aspect-video bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/30">
            <span class="text-white/50 font-mono text-sm">Insira uma URL de vídeo válida</span>
          </div>
        </div>

        <div _class="flex flex-col gap-1 pb-1 md:pb-0"> 
          <h2 class="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {{ finalData.title }}
          </h2>
          
          <div class="prose prose-lg max-w-none prose-invert text-white/90 leading-relaxed whitespace-pre-line break-words">
             <ContentRenderer v-if="finalDoc" :value="finalDoc" />
          </div>

          <div v-if="finalData?.buttonText" class="_pt-4">
            <NuxtLink 
              :to="finalData.meta?.buttonLink || finalData.buttonLink" 
              class="inline-block bg-white text-[#919749] px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-[#f0f0f0] transition-colors shadow-lg"
            >
              {{ finalData.buttonText }}
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </section>
  
  <div v-else class="w-full py-20 flex justify-center items-center bg-[#919749]">
    <i class="pi pi-spin pi-spinner text-white text-3xl"></i>
  </div>
</template>