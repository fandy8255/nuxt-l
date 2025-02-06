

<template>
    <div v-if="!loading">
        <nav v-if="is_admin">
            other navbar
        </nav>
        <Navbar v-else id="navbar"/>
        <div class="slot-wrapper mt-1">
            <slot class="main-content" />
        </div>
        <Footer />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

const is_admin=ref(false)
const loading=ref(true)


onMounted(async ()=>{
    console.log('layouttt')
    await isAd().then(res=>{
        console.log('res is', res)
        loading.value=false
    })

})

async function isAd() {

const supabase = useSupabaseClient();
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
    console.log('is the admin', result.data.is_admin )
    if (result?.data) {
        is_admin.value=true
        return result.data.is_admin
    }
} catch (error) {
    is_admin.value=false
    //return false
}
}





</script>

<style>
* {
    font-family: "Geist", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    
}

p{
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


a:hover{
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