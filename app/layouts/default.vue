<template>
  <div class="min-h-screen bg-[#fae9d7] flex flex-col">
    
    <PreviewBar />

    <main 
      class="flex-1 transition-all duration-300"
      :class="[
        // Padding padrão do site (pt-15/22)
        // Se preview ativo, aumentamos o padding (+10 do tailwind = 40px) para o CONTEÚDO não esconder
        isPreviewActive ? 'pt-[100px] md:pt-[128px] mb-8' : 'pt-15 md:pt-22' 
      ]"
    > 
       <div class="_max-w-7xl mx-auto w-full relative">
        
        <TopBar 
          class="transition-all duration-300"
          :style="{ top: isPreviewActive ? '40px' : '0px' }"
        />
        
        <slot />
       </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
const { isEnabled: isPreviewActive } = usePreview()
</script>