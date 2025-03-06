// stores/navbar.js
import { defineStore } from 'pinia';

export const useNavbarStore = defineStore('navbar', {
    state: () => ({
        is_admin: false,
    }),
    actions: {
        async generateHMACSignature(timestamp) {

            const { data, error } = await useFetch('/api/hmac', {
                query: { timestamp },
            });


            if (error.value) {
                // console.error('Error generating HMAC signature:', error.value);
                throw new Error('Failed to generate HMAC signature');
            }

            return data.value?.signature;
        },
        async getUser() {
            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            return user

        },

        async isAd() {
            const user = await this.getUser()

            if (!user) {
                this.is_admin = false;
                return;
            }

            const timestamp = Date.now().toString();
            const signature = await this.generateHMACSignature(timestamp);

            const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user),
                },
            });

            const result = await response.json();

            if (result.data.is_admin) {

                this.is_admin = true
                return true
            }
            this.is_admin = false
            return false
        },
    }
});