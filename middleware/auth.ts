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
  
  
  if (!session.value && to.path !== '/') {
    return navigateTo('/')
  }
    
})

/*
export default defineNuxtRouteMiddleware(async(to, from) => {
  const session = useSupabaseSession() // Already reactive and cached
  const userStore = useUserStore();
  const router = useRouter();
  
  console.log('userstore', userStore)

  if (!session.value && to.path !== '/login') {
    //const { error } = await useSupabaseClient().auth.signOut();
    //if (error) console.error('Sign-out');
    userStore.signOut({
        username: '',
        email: '',
        id: '',
        age: null,
        user_type: '',
        profile_description: '',
        profile_picture: '',
        ubicacion: '',
        logged_in: false,
        user_tok: '',
        user_profile: ''
    });
    //router.push('/');
    return navigateTo('/login')
  }
})*/
  

/*

export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const session = await supabase.auth.getSession(); // Fetch the session
  const userStore = useUserStore();

  // If there's no active session and the user is not trying to access the login page
  if (!session.data.session && to.path !== '/login') {
    // Clear the user store
    userStore.signOut({
      username: '',
      email: '',
      id: '',
      age: null,
      user_type: '',
      profile_description: '',
      profile_picture: '',
      ubicacion: '',
      logged_in: false,
      user_tok: '',
      user_profile: ''
    });

    // Invalidate the Supabase session
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign-out:', error);
    }

    // Redirect to the login page
    return navigateTo('/login');
  }
});

*/