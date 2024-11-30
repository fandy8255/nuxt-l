<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">User Dashboard</h1>
        <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div v-if="userData">
                <div class="row align-items-center g-4">
                    <!-- Profile Image -->
                    <div class="col-md-4 text-center">
                        <img :src="userData.profileImage || 'https://lh3.googleusercontent.com/pw/AP1GczMzQgL9SnnkpALEA_TJgpSmYHs9lfw9mxuDB19zuyaIwO5rPAxKwBQvy4ZBrGHwzg4XumzmkckW92daJTmND2dlrS-kXUmbammRyiFKBPPt77bF7qtMgiH-pulpnUsOxE6nCIOQHfjQLcQReerVNfQ=w900-h900-s-no?authuser=0'" alt="Profile Image"
                            class="img-fluid shadow-sm rounded"
                            style="width: 100%; height: auto; max-height: 400px; object-fit: cover;" />
                    </div>
                    <!-- User Data -->
                    <div class="col-md-8">
                        <div class="card shadow-sm border-0">
                            <div class="card-body">
                                <h3 class="card-title text-primary">{{ userData.username }}</h3>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">
                                        <strong>Email:</strong> {{ userData.email }}
                                    </li>
                                    <li class="list-group-item">
                                        <strong>Age:</strong> {{ userData.age }}
                                    </li>
                                    <li class="list-group-item">
                                        <strong>User Type:</strong> {{ userData.user_type }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-muted">
                No user data found.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSupabaseClient } from '#imports'


const supabase = useSupabaseClient()

// Reactive variables
const userData = ref(null);
const loading = ref(true);

// Fetch authenticated user data
const fetchUserData = async () => {
    try {
        // Get the authenticated user's session
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (user) {
            
            // Fetch user data by email
            /*
            const { data, error } = await supabase
                .from("userdata")
                .select("*")
                .eq("email", user.email)
                .single();

            if (error) throw error;
            
            userData.value = data;
            */
            
            
        } else {
            console.warn("No authenticated user found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    } finally {
        loading.value = false;
    }
};

// Lifecycle hook
onMounted(() => {
    fetchUserData();
});
</script>

<style scoped>
/* Add optional custom styles for the dashboard */
.card {
    border-radius: 12px;
}

.list-group-item {
    background-color: #f9f9f9;
    border: none;
}

.text-primary {
    font-weight: bold;
}

.shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>