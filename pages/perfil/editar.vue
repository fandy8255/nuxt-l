<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Actualizar Perfil</h1>
    <form @submit.prevent="updateProfile" class="p-4 border rounded">
      <div class="mb-3">
        <label for="username" class="form-label">Nombre de Usuario</label>
        <input type="text" id="username" v-model="form.username"
          :placeholder="user.username || 'Ingrese un nombre de usuario único'" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea id="description" v-model="form.description"
          :placeholder="user.description || 'Escribe una breve descripción...'" class="form-control"
          rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="profilePicture" class="form-label">Foto de Perfil</label>
        <input type="file" id="profilePicture" @change="handleFileUpload" class="form-control" />
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="verified" v-model="form.verified"
          :checked="user.verified" />
        <label class="form-check-label" for="verified">¿Verificar cuenta?</label>
      </div>
      <button type="submit" class="btn btn-primary w-100">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const supabase = useSupabaseClient()
const { data: { user } } = await supabase.auth.getUser() 

const userObj = ref({});
const form = ref({
  username: "",
  description: "",
  verified: false,
  profilePicture: null,
});

const getUserData = async (id) => {
  
  const timestamp = Date.now().toString();
  const signature = await userStore.generateHMACSignature(timestamp);

  const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `HVAC ${signature}`,
      'X-Timestamp': timestamp,
      'X-User-ID': `${id}`
    }
  });

  const result = await response.json()
  return result
}

const fetchUserData = async () => {
  try {

    if (user) {
      const userData = await getUserData(user.id.toString())
      userObj.value = userData;
      form.value.username = userData.data.username;
      form.value.description = userData.data.profile_description;
      form.value.verified = userData.data.verified;

    } else {
      
    }
  } catch (error) {
    
  }

};


const handleFileUpload = (event) => {
  form.value.profilePicture = event.target.files[0];
};

const updateProfile = async () => {

  if (form.value.profilePicture) {
    
  }

  try {
    const timestamp = Date.now().toString();
    const signature = await userStore.generateHMACSignature(timestamp);

    const response = await fetch("https://lingerie.fandy8255.workers.dev/api/user/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `HVAC ${signature}`,
        'X-Timestamp': timestamp,
        'X-User-ID': `${user.id.toString()}`
      },
      body: JSON.stringify({
        username: form.value.username,
        description: form.value.description,
        profilePicture: 'profile_pic_url',
      })
    });
    if (response.ok) {
      alert("Perfil actualizado con éxito");
    } else {
      const errorData = await response.json();
      alert("Error al actualizar el perfil");
    }
  } catch (error) {
    
  }
};


onMounted(async () => {
  const userData = await fetchUserData()
})
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
