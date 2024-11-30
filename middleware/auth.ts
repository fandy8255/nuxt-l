export default defineNuxtRouteMiddleware(async (to, from) => {
    const supabase = useSupabaseClient()
    const user = await supabase.auth.getUser()
    const session = useSupabaseSession()
  
    if (!user && to.path !== '/login') {
      return navigateTo('/login')
    }
  })