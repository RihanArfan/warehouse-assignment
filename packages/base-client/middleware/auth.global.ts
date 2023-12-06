export default defineNuxtRouteMiddleware((to) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated.value && to.path === "/login") {
    return navigateTo("/");
  }

  if (!isAuthenticated.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
