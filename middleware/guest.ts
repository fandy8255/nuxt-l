/*
export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useSupabaseSession() // Already reactive and cached
    const userStore = useUserStore();
    const router = useRouter();
    const supabase = useSupabaseClient()
    const user = await supabase.auth.getUser()

    async function generateHMACSignature(timestamp) {
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
    }

    async function isAd() {

        const supabase = useSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const timestamp = Date.now().toString(); // Prevent replay attacks
        const signature = await generateHMACSignature(timestamp);

        try {
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
            if (result?.data) {
                return result.data.is_admin
            }
        } catch (error) {
            return 0
        }
    }


    if (session.value && user && user.data.user) {
        const isAd_ = await isAd()
        if (isAd_) {
            router.push('/ad')
        } else {
            router.push('/dashboard')
        }

    }

    else {
        const { error } = await supabase.auth.signOut();
        if (userStore) {
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
            });

        }

    }

})*/