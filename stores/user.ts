import { defineStore } from 'pinia';
import { useSupabaseClient } from '#imports';

export const useUserStore = defineStore('user', {
    state: () => ({
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
        products: [], // Array to store seller's products
    }),
    actions: {
        setUser(userData) {
            Object.assign(this, userData, { logged_in: true });
        },
        signOut(userData) {
            Object.assign(this, userData, { logged_in: false, products: [] }); // Reset products on sign-out
        },
        updateUserProfile(updatedData) {
            Object.assign(this, updatedData);
        },
        async fetchUserData() {
            console.log('fetched once')
            if (this.logged_in) return; // Prevent duplicate fetches if data is already set

            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (this.products.length > 0) {
                console.log('Products are already loaded:', this.products);
                return;
            }

            const runtimeConfig = useRuntimeConfig();
            try {
                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                        'X-User': JSON.stringify(user),
                    },
                });

                const result = await response.json();
                if (result?.data) {
                    this.setUser({
                        username: result.data.username,
                        age: result.data.age,
                        email: result.data.email,
                        profile_description: result.data.profile_description,
                        profile_picture: result.data.profile_picture,
                        user_type: result.data.user_type,
                        logged_in: true,
                        ubicacion: result.data.ubicacion,
                        user_tok: user,
                        id: user.id,
                        user_profile: '/perfil/' + result.data.username,
                    });

                    // Fetch seller products if user is a seller
                    if (result.data.user_type === 'seller') {
                        this.fetchSellerProducts();

                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        },
        async fetchSellerProducts() {
            if (this.user_type !== 'seller') return; // Only fetch products for sellers
            const runtimeConfig = useRuntimeConfig();
            try {
                const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts?user_id=${this.id}`, {
                    method :'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                    }
                });

                const result = await response.json();
                
                console.log('resulted', result.data.results)
                if (result?.data) {
                    let arr=[]

                
                    this.products = result.data.results; // Set the seller's products

                }
              // return result.data.results
            } catch (error) {
                console.error('Error fetching seller products:', error.message);
            }
        },
        addProduct(product) {
            if (this.user_type !== 'seller') {
                console.error('Only sellers can add products.');
                return;
            }

            // Validate the product object
            if (!product || !product.id || !product.product_name || !product.product_price || !product.product_category) {
                console.error('Invalid product object. A product must have an id, name, and price.');
                return;
            }

            // Add the product to the products array
            this.products.push(product);
        },

        deleteProduct(productId) {
            if (this.user_type !== 'seller') {
                console.error('Only sellers can delete products.');
                return;
            }

        
            const productIndex = this.products.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                console.error('Product not found.');
                return;
            }
        
            this.products.splice(productIndex, 1);
            
        },
    },persist: {
        storage: piniaPluginPersistedstate.localStorage(),
      }
    
});