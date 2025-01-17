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
const { data: { user } } = await supabase.auth.getUser() //get user
const runtimeConfig = useRuntimeConfig(/*event*/)
//const supBuser = useSupabaseUser()

const userObj = ref({});
const form = ref({
  username: "",
  description: "",
  verified: false,
  profilePicture: null,
});

const getUserData = async (id) => {
  const response = await fetch('https://lingerie.fandy8255.workers.dev/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
      'X-User-ID': `${id}`
    }
  });

  const result = await response.json()
  return result
}

// Función para obtener datos del usuario al cargar el componente
const fetchUserData = async () => {
  try {

    if (user) {
      //console.log('id', user.id.toString())
      const userData = await getUserData(user.id.toString())
      console.log('usrdata', userData)
      console.log('usrdatausername', userData.username)
      userObj.value = userData;
      form.value.username = userData.data.username;
      form.value.description = userData.data.profile_description;
      form.value.verified = userData.data.verified;

    } else {
      //console.error("Error al obtener los datos del usuario.");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
  }

};

// Manejo de subida de archivos
const handleFileUpload = (event) => {
  form.value.profilePicture = event.target.files[0];
};

// Función para actualizar el perfil del usuario
const updateProfile = async () => {

  if (form.value.profilePicture) {
    //formData.append("profilePicture", form.value.profilePicture);
  }
  /* */
  try {
    const response = await fetch("https://lingerie.fandy8255.workers.dev/api/user/update", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
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
      alert(errorData.error || "Error al actualizar el perfil");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
  }
};


onMounted(async () => {
  const userData = await fetchUserData()
  //console.log(userData)
})
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
