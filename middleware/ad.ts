export default defineNuxtRouteMiddleware((to, from) => {
    const session = useSupabaseSession() // Already reactive and cached
    const navbarStore = useNavbarStore();
    
    
    if (!session.value && to.path !== '/') {
      return navigateTo('/')
    }
      
  })