<template>
  <footer class="site-footer" v-if="pageData">
    <div class="content-container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3 class="footer-title">{{ pageData.data.footer.box1.title }}</h3>
          <div class="founder-section">
           

            <div class="founder-content">
              <p v-html="pageData.data.footer.box1.body"></p>
               <!-- <img
              v-if="pageData.data.footer.box1.img"
              :src="pageData.data.footer.box1.img"
              :alt="pageData.data.footer.box1.title"
              class="founder-img"
            /> -->
              <NuxtLink
                v-if="pageData.data.footer.box1.link?.target"
                :to="pageData.data.footer.box1.link.target"
                class="text-link"
              >
                {{ pageData.data.footer.box1.link.label }} →
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">{{ pageData.data.footer.box2.title }}</h3>
          <p>{{ pageData.data.footer.box2.body }}</p>

          <div class="social-icons-wrapper">
            <a
              v-for="(url, network) in pageData.data.footer.box2.links"
              :key="network"
              :href="url"
              target="_blank"
              class="social-icon"
              :class="network"
              :aria-label="network"
            >
              <i :class="getSocialIcon(network)"></i>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">{{ pageData.data.footer.box3.title }}</h3>
          <div class="address-box">
            <i class="fas fa-map-marker-alt location-icon"></i>
            <p v-html="pageData.data.footer.box3.body"></p>
          </div>
          <NuxtLink
            v-if="pageData.data.footer.box3.link.target"
            :to="pageData.data.footer.box3.link.target"
            class="btn-outline"
          >
            {{ pageData.data.footer.box3.link.label }}
          </NuxtLink>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">{{ pageData.data.footer.box4.title }}</h3>
          <p>{{ pageData.data.footer.box4.body }}</p>
          <div class="contact-actions">
            <NuxtLink
              v-if="pageData.data.footer.box4.link?.target"
              :to="pageData.data.footer.box4.link.target"
              class="btn-solid"
            >
              {{ pageData.data.footer.box4.link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright-bar">
      <div class="content-container">
        <p>{{ pageData.data.footer.copyright.body }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// --- Ícones e Configurações ---
const socialIcons = {
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
};

const getSocialIcon = (key) => socialIcons[key] || "fas fa-link";

// --- Dados ---
// Mantendo a lógica de busca que você prefere (useSmartContent)
const { data: pageData } = await useFetch(`/api/page/settings`, {
    lazy: true,
    server: false,
})

</script>

<style scoped>
/* --- CONFIGURAÇÕES GERAIS --- */
.site-footer {
  background-color: #f8f9fa; /* Cor de fundo suave */
  color: #555;
  padding-top: 4rem;
  font-family: sans-serif;
  width: 100%;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- GRID SYSTEM (A mágica que coloca lado a lado) --- */
.footer-grid {
  display: grid;
  /* Cria 4 colunas de tamanho IGUAL */
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem; /* Espaço entre as colunas */
  padding-bottom: 3rem;
}

/* --- ESTILO DAS COLUNAS --- */
.footer-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

/* Linha decorativa laranja embaixo do título */
.footer-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: #ff9900;
}

.footer-col p {
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

/* --- COLUNA 1: FUNDADOR --- */
.founder-img {
  width: 70px;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.text-link {
  color: #ff9900;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}
.text-link:hover {
  text-decoration: underline;
}

/* --- COLUNA 2: SOCIAL --- */
.social-icons-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Redondo */
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
}

.social-icon:hover {
  transform: translateY(-3px);
}

/* Cores específicas */
.social-icon.facebook {
  background-color: #3b5998;
}
.social-icon.instagram {
  background: linear-gradient(
    45deg,
    #f09433,
    #e6683c,
    #dc2743,
    #cc2366,
    #bc1888
  );
}
.social-icon.youtube {
  background-color: #ed302f;
}
.social-icon.tiktok {
  background-color: #000;
}

/* --- COLUNA 3: ENDEREÇO --- */
.address-box {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}

.location-icon {
  color: #ff9900;
  margin-top: 5px;
}

/* --- COLUNA 4: BOTÕES --- */
.btn-solid {
  display: inline-block;
  background-color: #ff9900;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}
.btn-solid:hover {
  background-color: #e68a00;
}

.btn-outline {
  display: inline-block;
  border: 1px solid #2c3e50;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
}
.btn-outline:hover {
  background-color: #2c3e50;
  color: white;
}

/* --- COPYRIGHT BAR --- */
.copyright-bar {
  background-color: #e9ecef;
  padding: 1.5rem 0;
  text-align: center;
  border-top: 1px solid #dee2e6;
  font-size: 0.85rem;
}

/* --- RESPONSIVIDADE (MOBILE E TABLET) --- */
/* Abaixo de 992px (Tablets): Vira 2 colunas */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Abaixo de 600px (Celulares): Vira 1 coluna */
@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-title::after {
    left: 50%;
    transform: translateX(-50%); /* Centraliza a linha laranja */
  }

  .social-icons-wrapper,
  .address-box {
    justify-content: center;
  }

  .founder-img {
    margin: 0 auto 1rem auto;
    display: block;
  }

  .founder-section {
    display: flex; /* Ativa o layout lado a lado */
    align-items: flex-start; /* Alinha os itens pelo topo */
    gap: 15px; /* Espaço entre a imagem e o texto */
  }

  .founder-img {
    width: 80px; /* Defina uma largura fixa para a imagem */
    height: auto;
    flex-shrink: 0; /* Impede que a imagem seja esmagada se o texto for grande */
    object-fit: contain; /* Garante que a imagem não distorça */
  }

  .founder-content p {
    margin-top: 0; /* Remove margem do topo para alinhar com a imagem */
    margin-bottom: 8px; /* Espaço entre o texto e o link */
    font-size: 0.9rem; /* Ajuste fino da fonte se necessário */
    line-height: 1.4;
  }
}
</style>
