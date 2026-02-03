export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Se NÃO estava em preview antes, não faz nada
  if (from.query.preview !== 'true') return;

  // 2. [NOVO] Se o usuário está indo explicitamente para preview=false,
  // permitimos a navegação e deixamos ele "escapar" do loop.
  if (to.query.preview === 'false') return;

  // 3. Se o destino não tem preview=true (e não é false), forçamos o true
  if (to.query.preview !== 'true') {
    return navigateTo({
      path: to.path,
      query: { ...to.query, preview: 'true' },
      hash: to.hash
    });
  }
});