<script setup lang="ts">
import Listfiles from "~/components/content/Listfiles/index.vue";
import Breadcrumb from "primevue/breadcrumb";
// import Carrossel from "~/components/Carrossel.vue";
// import QuickAccessBar from "~/components/QuickAccessBar.vue";
// import Banner from "~/components/Banner.vue";
// import HomeVideoSection from "~/components/HomeVideoSection.vue";
// import CardHorizontal from "~/components/CardHorizontal.vue";
// import Wrapper from "~/components/Wrapper.vue"; 

const route = useRoute();

const path = computed(() => {
  if (route.path === "/") return "index";
  return route.path.replace(/^\//, "");
});

// Detecta se estamos em modo Preview
const isPreview = computed(() => {
  return (
    route.query.preview === "true" ||
    (import.meta.client && window.location.hostname.startsWith("preview."))
  );
});

// Alterna entre API de produção (JSON estático) ou Preview (Markdown live)
const endpoint = computed(() => {
  return isPreview.value
    ? `/api/preview/${path.value}`
    : `/api/page/${path.value}`;
});

const {
  data: content,
  status,
  error,
} = await useFetch(endpoint, {
  key: `page-${path.value}`,
  watch: [endpoint, () => route.fullPath],
  lazy: false,
});

// --- NOVA FUNÇÃO DE TRATAMENTO DE IMAGEM ---
// --- NOVA FUNÇÃO DE TRATAMENTO DE IMAGEM (CORRIGIDA) ---
const getImageUrl = (imgPath: string) => {
  if (!imgPath) return "";
  
  // 1. Se for link externo (http) ou absoluto (/assets/...), retorna direto
  if (imgPath.startsWith("http") || imgPath.startsWith("/assets")) return imgPath;

  let url = imgPath;

  // 2. Se a imagem não começar com '/', é um arquivo local relativo (ex: "foto.jpg")
  // Precisamos adicionar o contexto da página atual.
  if (!url.startsWith('/')) {
    // Remove a barra inicial da rota atual (ex: "/eventos/atmaval" -> "eventos/atmaval")
    const currentFolder = route.path === '/' ? '' : route.path.replace(/^\//, '');

    // Monta o caminho:
    // Home: /assets/foto.jpg
    // Interna: /assets/eventos/atmaval/foto.jpg
    url = currentFolder 
      ? `/assets/${currentFolder}/${imgPath}` 
      : `/assets/${imgPath}`;
  }
  
  // 3. Lógica do Preview (Query String e Cache Busting)
  if (isPreview.value) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}preview=true&t=${Date.now()}`;
  }
  
  return url;
};
// -------------------------------------------

const pageMeta = computed(() => content.value?.data?.meta || {});
const isFullWidth = computed(() => pageMeta.value.tela === "full");
const showTitle = computed(() => pageMeta.value.showtitle !== false);
const showBreadcrumbs = computed(
  () => pageMeta.value.showbreadcrumbs !== false,
);

const hasTopImages = computed(() => {
  const imgs = content.value?.data?.topimages;
  return Array.isArray(imgs) && imgs.length > 0;
});

const hasImages = computed(() => {
  const imgs = content.value?.data?.images;
  return Array.isArray(imgs) && imgs.length > 0;
});

useSeoMeta({
  title: () => content.value?.data?.title || "Nova Gokula",
  description: () => content.value?.data?.description,
  ogTitle: () => content.value?.data?.title || "Nova Gokula",
  ogDescription: () => content.value?.data?.description,
  ogImage: () => content.value?.data?.image,
});

const breadcrumbItems = computed(() => {
  const items = [{ label: "Início", route: "/", icon: "pi pi-home" }];
  if (path.value === "index") return items;

  const rawPath = path.value;
  const parts = rawPath.split("/").filter(Boolean);
  let currentPath = "";

  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    const isLast = index === parts.length - 1;
    let label =
      isLast && content.value?.data?.title
        ? content.value.data.title
        : part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    items.push({
      label: label,
      route: isLast ? null : currentPath,
      class: isLast ? "pointer-events-none text-zinc-500" : "",
    });
  });
  return items;
});
</script>

<template>
  <main
    class="slug-page w-full"
    :class="
      isFullWidth
        ? 'p-0 max-w-full'
        : 'max-w-7xl mx-auto px-4 md:px-12 lg:px-20 pt-8 pb-20'
    "
  >
    <nav
      class="breadcrumb-container"
      v-if="
        showBreadcrumbs && breadcrumbItems.length > 1 && content?.data?.title
      "
    >
      <Breadcrumb :model="breadcrumbItems">
        <template #item="{ item }">
          <NuxtLink v-if="item.route" :to="item.route" class="breadcrumb-link">
            <span :class="item.icon" v-if="item.icon"></span>
            <span class="ml-2">{{ item.label }}</span>
          </NuxtLink>
          <span v-else class="breadcrumb-current">{{ item.label }}</span>
        </template>
      </Breadcrumb>
    </nav>

    <div
      v-if="status === 'pending'"
      class="status-message flex justify-center py-10"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-[#d97706]"></i>
    </div>

    <div v-else-if="error || !content" class="text-center py-20">
      <h2 class="text-4xl font-bold text-[#421406] mb-4">
        Página não encontrada
      </h2>
      <p class="text-[#7d5d43] text-lg mb-8">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <NuxtLink
        to="/"
        class="px-6 py-3 bg-[#d97706] text-white rounded-lg hover:bg-[#b45309] transition-colors"
      >
        Voltar para o Início
      </NuxtLink>
    </div>

    <div v-else :class="['content-wrapper', { 'has-images': hasImages }]">
      
      <section v-if="hasTopImages" class="top-images-row mb-1 col-span-full">
        <div class="top-images-scroll custom-scrollbar">
         
          <img
            v-for="(img, index) in content?.data?.topimages"
            :key="'top-' + index"
            :src="getImageUrl(img)" 
            class="top-image-card"
            alt="Imagem de destaque"
          />
        </div>
      </section>

      <aside v-if="hasImages" class="gallery-side">
        <div class="image-stack">
         
          <img
            v-for="(img, index) in content?.data?.images"
            :key="index"
            :src="getImageUrl(img)"
            class="gallery-img"
            loading="lazy"
            alt="Galeria"
          />
        </div>
      </aside>

      <article
        class="content-side max-w-none"
        :class="
          !isFullWidth
            ? 'prose prose-lg prose-headings:text-[#421406] prose-p:text-[#7d5d43]'
            : ''
        "
      >
        <header v-if="showTitle" class="page-header not-prose">
          <h1
            class="font-serif text-[35px] md:text-[40px] lg:text-[45px] font-extrabold text-[#4a3728] mb-0"
            _class="text-[10px] md:text-[10px] font-black text-[#421406] tracking-tight mb-0"
          >
            {{ content?.data?.title || "" }}
          </h1>
          <div v-if="content?.data?.title" class="header-divider"></div>
        </header>
        <div
           class=" _max-w-5xl flex flex-col gap-0 text-[21px] leading-relaxed leading-[1.75] text-[#4a3728]
         first-letter:text-4xl first-letter:font-bold first-letter:mr-1"    >
          <MDCRenderer
          class="[&_p]:mt-0"
            v-if="content.body"
            :body="content.body"
            :data="content.data"
            :components="{
              listfiles: Listfiles
            }"
          />
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
p {
  margin: 100px;
}

.slug-page {
  min-height: 80vh;
}
.breadcrumb-container {
  margin-bottom: 2rem;
}
:deep(.p-breadcrumb) {
  background: transparent !important;
  border: none;
  padding: 0;
}
:deep(.p-breadcrumb ul) {
  background: transparent !important;
  padding: 0;
}
.breadcrumb-link {
  color: #d97706;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.breadcrumb-link:hover {
  color: #b45309;
  text-decoration: underline;
}
.breadcrumb-current {
  color: #7d5d43;
  opacity: 0.8;
}
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}
.content-wrapper.has-images {
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 1024px) {
  .content-wrapper.has-images {
    grid-template-columns: 320px 1fr;
    gap: 3rem;
  }
}
.top-images-row {
  grid-column: 1 / -1;
}
.top-images-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}
.top-image-card {
  width: 100%;
  min-width: 300px;
  /*height: 400px;*/
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  scroll-snap-align: start;
}
.gallery-side {
  height: fit-content;
}
.image-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.gallery-img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  transition: transform 0.2s;
}
.gallery-img:hover {
  transform: scale(1.02);
}
@media (min-width: 1024px) {
  .gallery-side {
    position: sticky;
    top: 2rem;
  }
}
.content-side {
  min-width: 0;
}
.page-header {
  margin-bottom: 1.3rem;
}
.header-divider {
  height: 4px;
  background: linear-gradient(to right, #d97706, transparent);
  width: 80px;
  _margin: 1.5rem 0 0.5rem 0;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}
@media (max-width: 1024px) {
  .image-stack {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
}
@media (max-width: 640px) {
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>