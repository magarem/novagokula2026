<template>
  
  <Carrossel class="w-full" />

  <QuickAccessBar source="_home/quickAccessBar"/>

  <div class="_container md:mx-12 md:px-0 py-0 my-0">
   
    <CardHorizontalVideo class="md:my-10" source="_home/bemvindo"/>
    <Banner border-radius="24px" class="md:mb-15" source="_home/banner_prabhupada" link="/sobre/prabhupada" />
    <Banner border-radius="24px" class="md:mb-15" source="_home/banner_visitacao" link="sobre/visitacao" />

    <Wrapper
      title="Nossos Eventos"
      subtitle="Confira o que está acontecendo em Nova Gokula"
      titleAlign="text-center"
      titleColor="text-[#421406]"
    >

    <Listfiles
      class="mb-25"
      card_width = "100px"
      :limit="4"
      section = "content/eventos"
      source="_home/proximos-eventos"
    />
    </Wrapper>  

    <Banner
      class="md:mt-15 md:mb-10"
      source="_home/banner_projetos"
      link="querodoar"
      border-radius="24px"
    />
  </div>
</template>
<script setup lang="ts">
import Carrossel from "~/components/content/Carrossel.vue";
import QuickAccessBar from "~/components/QuickAccessBar.vue";
import CardHorizontalVideo from "~/components/content/CardHorizontalVideo.vue";
import Banner from "~/components/content/Banner.vue";
import Wrapper from "~/components/content/Wrapper.vue";
import Bemvindo from "~/components/Bemvindo.vue";
import Listfiles from "~/components/content/Listfiles/index.vue";
</script>
