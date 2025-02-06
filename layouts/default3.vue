<template>
    <div v-if="!loading">
        <NavbarAdmin v-if="is_admin" />
        <Navbar v-else id="navbar" />
        <div class="slot-wrapper mt-1">
            <slot class="main-content" />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient } from '#imports';

// Reactive state
const is_admin = ref(false);
const loading = ref(true);
const supabase = useSupabaseClient();

// HMAC Signature Generation
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

// Check if user is admin
async function isAd() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

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
        console.log('Is the user an admin?', result?.data?.is_admin);
        return result?.data?.is_admin || false;
    } catch (error) {
        console.error('Error fetching admin status:', error);
        return false;
    }
}

// On component mount
onMounted(async () => {
    console.log('Layout mounted');
    const adminStatus = await isAd().then(res=>{
        is_admin.value = res; 
        loading.value = false;
    });
});
</script>

<style>
* {
    font-family: "Geist", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

p {
    color: rgb(47, 45, 45) !important;
}

#navbar {
    z-index: 1000;
    margin: 0 !important;
    top: 0 !important;
}

a {
    color: rgb(0, 0, 0) !important;
}

a:hover {
    color: blue !important;
}

h2 {
    font-weight: 500;
    font-style: normal;
}

* {
    color: rgb(59, 59, 59) !important;
    text-decoration: none;
}

.slot-wrapper {
    margin-top: 10px !important;
}
</style>