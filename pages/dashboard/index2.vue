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
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Username</td>
                <td>{{ userData.username }}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{{ userData.email }}</td>
              </tr>
              <tr>
                <td>Age</td>
                <td>{{ userData.age }}</td>
              </tr>
              <tr>
                <td>User Type</td>
                <td>{{ userData.user_type }}</td>
              </tr>
            </tbody>
          </table>
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
        const { data, error } = await supabase
          .from("userdata")
          .select("*")
          .eq("email", user.email)
          .single();
  
        if (error) throw error;
        userData.value = data;
        localStorage.setItem('username', data.username);
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
  
  <style>
  .table {
    margin-top: 20px;
  }
  </style>