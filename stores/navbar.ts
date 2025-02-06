// stores/navbar.js
import { defineStore } from 'pinia';

export const useNavbarStore = defineStore('navbar', {
    state: () => ({
        is_admin: false,
    }),
    actions: {
        async generateHMACSignature(timestamp) {
            const runtimeConfig = useRuntimeConfig();
            const secretKey = runtimeConfig.public.secretApiKey;

            const encoder = new TextEncoder();
            const keyData = encoder.encode(secretKey);
            const timestampData = encoder.encode(timestamp);

            const key = await crypto.subtle.importKey(
                'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
            );

            const signatureBuffer = await crypto.subtle.sign('HMAC', key, timestampData);

            const signatureArray = Array.from(new Uint8Array(signatureBuffer));
            const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

            return signatureHex;
        },

        async updateNavbar() {
            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
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
                console.log('hitted navbarstore, user is admin')
                this.is_admin= true
                return
            }
            this.is_admin=false

            // this.is_admin = result?.data?.is_admin || false;
        },
    }
});