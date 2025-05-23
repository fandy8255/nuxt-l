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
        feed: [],
        blocked_users: [],
        blocked_by: [],
        orders: [],
        reviews: [],
        message_count: 0
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
            Object.assign(this, userData, { logged_in: false, products: [] });
        },
        updateUserProfile(updatedData) {
            Object.assign(this, updatedData);
        },

        async generateHMACSignature(timestamp) {

            const { data, error } = await useFetch('/api/hmac', {
                query: { timestamp },
            });


            if (error.value) {
                
                throw new Error('Failed to generate HM');
            }

            return data.value?.signature;
        },

        async getUser() {
            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            return user

        },

        async isAd() {

            const user = await this.getUser()

            if (!user) return;

            const timestamp = Date.now().toString();
            const signature = await this.generateHMACSignature(timestamp);

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

        },

        async fetchFollowedData() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {

                if (!this.followed || this.followed.length === 0) {
                    return;
                }

                const userId = this.id;

                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);


                const response = await fetch(
                    'https://lingerie.fandy8255.workers.dev/api/fetch-followed-data',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `HVAC ${signature}`,
                            'X-Timestamp': timestamp,
                        },
                        body: JSON.stringify({ followedUsers: this.followed, userId }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                if (data.success) {

                    const sortedFeed = data.data.sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    });

                    this.feed = sortedFeed;
                    return data.data

                } else {

                }
            } catch (error) {
                if (environment === "development") {
                    //console.error('Error:', error.message);
                }

            }
        },

        async fetchLikedProducts() {

            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;

            try {

                if (!this.logged_in) return;

                const supabase = useSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);


                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/liked-products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify(user),
                    },
                });

                const result = await response.json();

                if (result?.likedProducts) {
                    this.liked_products = result.likedProducts;
                }
            } catch (error) {
                if (environment === "development") {
                    //console.error('Error fetching liked products:', error.message);
                }

            }
        },

        async fetchOrders() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {
                const supabase = useSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();
                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);

                const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify(user),
                    },
                });

                const parsed = await response.json();
               
                this.orders = parsed;
              

            } catch (error) {
                if (environment === "development") {
                    console.log('error fetching orders', error)
                    //console.error('Error fetching liked products:', error.message);
                }

            }

        },


        async fetchBlockedUsers() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {
                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);

                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/blocked-users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify({ id: this.id, username: this.username }),
                    },
                });

                const result = await response.json();

                if (result?.blocked_users) {
                    this.blocked_users = result.blocked_users;
                }
            } catch (error) {
                if (environment === "development") {
                    //console.error('Error fetching blocked users:', error.message);
                }

            }
        },

        async fetchBlockedBy() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {
                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);

                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/blocked-by-users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify({ id: this.id, username: this.username }),
                    },
                });

                const result = await response.json();

                if (result?.blocked_by) {
                    this.blocked_by = result.blocked_by;
                }
            } catch (error) {
                if (environment === "development") {
                    //console.error('Error fetching blocked users:', error.message);
                }

            }
        }, async fetchThreads() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {
                const supabase = useSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();

                const timestamp = Date.now().toString(); // Prevent replay attacks
                const signature = await this.generateHMACSignature(timestamp);

                const response = await fetch('https://lingerie.fandy8255.workers.dev/api/threads', {
                    headers: {
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify(user)
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch threads');
                }
                const data = await response.json()

                const blockedUsernames = [
                    ...this.blocked_users.map(user => user.username),
                    ...this.blocked_by.map(user => user.username)
                ];

                // Filter threads where neither sender nor receiver is in the blocked list
                const filteredThreads = data.filter(thread => {
                    return !blockedUsernames.includes(thread.sender_name) &&
                        !blockedUsernames.includes(thread.receiver_name);
                });

                const messageCount = filteredThreads.filter(elem => elem.last_message_owner !== this.username)
                this.message_count = messageCount.lengt
                this.threads = filteredThreads;

            } catch (error) {
                if (environment === "development") {
                    //console.error('Error fetching threads:', error);
                }

            }
        },

        async fetchReviews() {
            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            try {
                const supabase = useSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();
                const timestamp = Date.now().toString();
                const signature = await this.generateHMACSignature(timestamp);

                const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/reviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                        'X-User': JSON.stringify(user),
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch reviews');
                const parsed = await response.json();
                
                this.reviews = parsed; // Store reviews in the userStore
            
            } catch (error) {
                if (environment === "development") {
                    
                }
            }
        },

        async fetchUserData() {

            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;
            //console.log('fetching user data')

            if (this.logged_in) return; // Prevent duplicate fetches if data is already set

            const supabase = useSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (environment === "development") {
                // console.log('user', user)
            }


            if (!user) {
                // console.log('no user found')
                return;
            }

            if (this.products.length > 0) {
                //console.log('Products are already loaded:', this.products);
                return;
            }

            const timestamp = Date.now().toString(); // Prevent replay attacks
            const signature = await this.generateHMACSignature(timestamp);

            if (environment === "development") {
                //console.log('generated HMAC', signature)
            }

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
                                'Authorization': `HVAC ${signature}`,
                                'X-Timestamp': timestamp,
                                'X-User': JSON.stringify(user),
                            },
                        }),
                        fetch('https://lingerie.fandy8255.workers.dev/api/followed', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `HVAC ${signature}`,
                                'X-Timestamp': timestamp,
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

                    if (result.data.user_type === 'seller') {
                        this.fetchSellerProducts();

                    }

                    await this.fetchLikedProducts();
                    await this.fetchFollowedData();
                    await this.fetchBlockedUsers()
                    await this.fetchBlockedBy()
                    await this.fetchThreads()
                    await this.fetchOrders()
                    await this.fetchReviews()
                }
            } catch (error) {
                //console.error('Error fetching user data:', error);
                if (environment === "development") {
                    //console.error('Error fetching user data:', error);
                }
            }
        },
        async fetchSellerProducts() {

            const runtimeConfig = useRuntimeConfig();
            const environment = runtimeConfig.public.dev;

            if (this.user_type !== 'seller') return;

            const timestamp = Date.now().toString();
            const signature = await this.generateHMACSignature(timestamp);

            try {
                const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/getProducts?user_id=${this.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `HVAC ${signature}`,
                        'X-Timestamp': timestamp,
                    }
                });

                const result = await response.json();

                if (result?.data) {
                    let arr = []
                    this.products = result.data.results;
                }

            } catch (error) {
                if (environment === "development") {
                    //console.error('Error fetching seller products:', error);
                }
            }
        },
        addToFeed(item) {

            if (this.user_type !== 'seller' && item.type === 'product') {
                return;
            }
            if (!item || !item.id) {
                //console.error('Invalid item object');
                return;
            }

            this.feed.unshift(item);
        },
        addProduct(product) {
            //console.log('product from store is', product)
            if (this.user_type !== 'seller') {
                return;
            }

            if (!product || !product.id || !product.product_name || !product.product_price || !product.product_category) {
                return;
            }

            product.profile_picture = this.profile_picture;
          

            this.products.unshift(product);
        },
        addToOrders(item) {


            if (this.user_type !== 'buyer') {
                return;
            }
            if (!item || !item.id) {
               
                return;
            }

            this.orders.unshift(item);
        },
        addToReviews(review) {
            if (!review || !review.id) {
               
                return;
            }
        
            this.reviews.unshift(review); // Add the review to the beginning of the array
            
        },
        deleteFromReviews(reviewId) {
            if (!reviewId) {
               
                return;
            }
        
            const reviewIndex = this.reviews.findIndex(review => review.id === reviewId);
            if (reviewIndex === -1) {
                
                return;
            }
        
            this.reviews.splice(reviewIndex, 1); // Remove the review from the array
            
        },

        deleteProduct(productId) {
            if (this.user_type !== 'seller') {
                return;
            }
            const productIndex = this.products.findIndex(product => product.id === productId);
            if (productIndex === -1) {
                
                return;
            }

            this.products.splice(productIndex, 1);

        },
    }, persist: {
        storage: piniaPluginPersistedstate.localStorage(),
    }

});