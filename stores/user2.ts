import { defineStore } from 'pinia';
import { useSupabaseClient } from '#imports';

/*
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    age: null,
    profile_description: '',
    profile_image: '',
    logged_in: false,
    ubicacion: '',
  }),
  actions: {
    setUser(userData) {
      this.username = userData.username;
      this.age = userData.age;
      this.profile_description = userData.profile_description;
      this.profile_image = userData.profile_image;
      this.logged_in = userData.logged_in;
      this.ubicacion = userData.ubicacion;
    },
    async fetchUserData() {
      if (this.logged_in) return; // Prevent duplicate fetches if data is already set

      const supabase = useSupabaseClient();
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) return;

      const runtimeConfig = useRuntimeConfig();
      try {
        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
            'X-User': JSON.stringify(authUser.user),
          },
        });

        const result = await response.json();
        if (result?.data) {
          this.setUser({
            username: result.data.username,
            age: result.data.age,
            profile_description: result.data.profile_description,
            profile_image: result.data.profile_image,
            logged_in: true,
            ubicacion: result.data.ubicacion,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    },
  },persist:true
});*/