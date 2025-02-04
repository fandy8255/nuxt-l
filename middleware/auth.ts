/*
export default defineNuxtRouteMiddleware(async (to, from) => {
    const supabase = useSupabaseClient()
    const user = await supabase.auth.getUser()
    const session = useSupabaseSession()
  
    if (!user && to.path !== '/login') {
      return navigateTo('/login')
    }
  })
*/

/*
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  //const session = useSupabaseSession();

  // Create a cache key based on the user's session
  //const cacheKey = `auth-${session.value?.user?.id}`;

  const cacheKey=`user_`
  // Check if the authentication result is cached
  const cachedAuth = await useStorage().getItem(cacheKey);

  if (cachedAuth === true) {
    // User is authenticated (from cache)
    return;
  }

  // Fetch the user from Supabase
  const { data: user, error } = await supabase.auth.getUser();

  if (!user || error) {
    // User is not authenticated
    if (to.path !== '/login') {
      return navigateTo('/login');
    }
  } else {
    // Cache the authentication result for 10 seconds
    await useStorage().setItem(cacheKey, true, { ttl: 10 }); // TTL in seconds
  }
});*/

export default defineNuxtRouteMiddleware((to, from) => {
  const session = useSupabaseSession() // Already reactive and cached

  if (!session.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})