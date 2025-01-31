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
        products: [],
        followers: [],
        followed: [],
        liked_products: [],
        feed: []
    }),
    actions: {
        setUser(userData) {
            Object.assign(this, userData, { logged_in: true });
        },
        updateFollowersAndFollowed({ followers, followed }) {
            this.followers = followers;
            this.followed = followed;
        },
        signOut(userData) {
            Object.assign(this, userData, { logged_in: false, products: [] }); // Reset products on sign-out
        },
        updateUserProfile(updatedData) {
            Object.assign(this, updatedData);
        },

        async isAd() {

            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

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
                    return result.data.is_admin
                }
            } catch (error) {
                return 0
            }

        },
        async fetchFollowedData() {
            try {
                if (!this.followed || this.followed.length === 0) {
                    console.log('No followed users found.');
                    return;
                }
                const runtimeConfig = useRuntimeConfig();
                //const userIds = followed.map(user => user.id);
                const userId = this.id;

                const response = await fetch(
                    'https://lingerie.fandy8255.workers.dev/api/fetch-followed-data',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                        },
                        body: JSON.stringify({ followedUsers: this.followed, userId }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                if (data.success) {
                    console.log('fetched feed from store yah')
                    this.feed = data.data;
                    //return this.feed
                } else {
                    console.error('Error fetching data:', data.error);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        },

        async fetchLikedProducts() {
            if (!this.logged_in) return; // Ensure the user is logged in

            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const runtimeConfig = useRuntimeConfig();
            try {
                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/liked-products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                        'X-User': JSON.stringify(user),
                    },
                });

                const result = await response.json();
                if (result?.likedProducts) {
                    this.liked_products = result.likedProducts; // Update the liked_products state
                }
            } catch (error) {
                console.error('Error fetching liked products:', error.message);
            }
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

                    const [followersResponse, followedResponse] = await Promise.all([
                        fetch('https://lingerie.fandy8255.workers.dev/api/followers', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                                'X-User': JSON.stringify(user),
                            },
                        }),
                        fetch('https://lingerie.fandy8255.workers.dev/api/followed', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${runtimeConfig.public.secretApiKey}`,
                                'X-User': JSON.stringify(user),
                            },
                        }),
                    ]);

                    const [followersResult, followedResult] = await Promise.all([
                        followersResponse.json(),
                        followedResponse.json(),
                    ]);

                    this.followers = followersResult.followers || [];
                    this.followed = followedResult.followed || [];

                    // Fetch seller products if user is a seller
                    if (result.data.user_type === 'seller') {
                        this.fetchSellerProducts();

                    }

                    await this.fetchLikedProducts();
                    await this.fetchFollowedData();
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
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${runtimeConfig.public.secretApiKey}`,
                    }
                });

                const result = await response.json();

                console.log('resulted', result.data.results)
                if (result?.data) {
                    let arr = []


                    this.products = result.data.results; // Set the seller's products

                }
                // return result.data.results
            } catch (error) {
                console.error('Error fetching seller products:', error.message);
            }
        },
        addToFeed(item) {
            console.log('addedd product to feed', item)
            if (this.user_type !== 'seller' && item.type === 'product') {
                console.error('Only sellers can add products.');
                return;
            }

            // Validate the product object
            if (!item || !item.id) {
                console.error('Invalid item object');
                return;
            }

            // Add the product to the products array
            this.feed.unshift(item);
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
            this.products.unshift(product);
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
    }, persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }

});