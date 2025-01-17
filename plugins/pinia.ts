import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


// Doing something with nuxtApp
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
