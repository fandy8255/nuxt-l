export default defineNuxtRouteMiddleware(async (to, from) => {
  //const session = useSupabaseSession() // Already reactive and cached
  const navbarStore = useNavbarStore();
  //const userStore = useUserStore()
  const user= await navbarStore.getUser()
  const isAd = await navbarStore.isAd()
  const router =useRouter()

  if (!user || !isAd ) {

    /*
    const { error } = await useSupabaseClient().auth.signOut();
    if (error) {
      //console.error(error);
    }
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
      user_profile: '',
      products: [],
      followers: [],
      followed: [],
      liked_products: [],
      feed: [],
      blocked_users: [],
      blocked_by: [],
      message_count: 0
    });*/

   //router.push('/')
   //return abortNavigation('/')
   return navigateTo('/')
  }

})