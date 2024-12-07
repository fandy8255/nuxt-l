import { defineStore } from 'pinia';
import { useSupabaseClient } from '#imports';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        email: '',
        id:'',
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

        setUser(userData) {
            Object.assign(this, userData, { logged_in: true });
        },
        signOut(userData){
            Object.assign(this, userData);
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
                        email:result.data.email,
                        profile_description: result.data.profile_description,
                        profile_picture: result.data.profile_picture,
                        user_type:result.data.user_type,
                        logged_in: true,
                        ubicacion: result.data.ubicacion,
                        user_tok:user,
                        id:user.id,
                        user_profile:'/perfil/'+ result.data.username
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        },
    }, persist: true
});