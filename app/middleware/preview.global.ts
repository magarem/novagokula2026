// middleware/preview.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Se tiver na URL, atualiza o cookie
  if (to.query.preview === 'true') {
    const cookie = useCookie('preview_mode')
    cookie.value = 'true'
  }
  
  // Opcional: Se quiser limpar a URL para ficar bonita
  // (Mas manter o cookie ativo)
  if (to.query.preview === 'true' && process.client) {
    // Remove o query param sem recarregar a página
    const url = new URL(window.location.href)
    url.searchParams.delete('preview')
    window.history.replaceState({}, '', url)
  }
})