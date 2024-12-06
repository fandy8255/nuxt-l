import { defineStore } from 'pinia';
import { useSupabaseClient } from '#imports';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        email: '',
        age: null,
        user_type: '',
        profile_description: '',
        profile_picture: '',
        ubicacion: '',
        logged_in: false,
        user_tok:'',
        user_profile:''
    }),
    actions: {

        setUser(userData ) {
            Object.assign(this, userData, { logged_in: true });
        },
        updateUserProfile(updatedData) {
            Object.assign(this, updatedData);
        },
        async fetchUserData() {
            if (this.logged_in) return; // Prevent duplicate fetches if data is already set

            const supabase = useSupabaseClient();
            //const { data: authUser } = await supabase.auth.getUser();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const runtimeConfig = useRuntimeConfig();
            try {
                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                        'X-User': JSON.stringify(user),
                    },
                });

                const result = await response.json();
                if (result?.data) {
                    this.setUser({
                        username: result.data.username,
                        age: result.data.age,
                        profile_description: result.data.profile_description,
                        profile_picture: result.data.profile_picture,
                        logged_in: true,
                        ubicacion: result.data.ubicacion,
                        user_tok:user,
                        user_profile:'/perfil/'+ result.data.username
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        },
    }, persist: true
});