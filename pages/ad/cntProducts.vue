<template>
    <div>
        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center mt-5" style="height: 600px !important; margin-top: 100px !important;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Products Table -->
        <div class="container-fluid" v-else>
            <div class="container">
                <FilterSortSearchProducts @update-products="updateProducts" :isCNT="true" />
            </div>

            <div v-if="paginatedProducts" class="container-fluid d-flex justify-content-center mt-4">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th @click="sortByColumn('id')">
                                ID
                                <span v-if="sortBy === 'id'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>
                                User
                            </th>
                            <th @click="sortByColumn('product_name')">
                                Product Name
                                <span v-if="sortBy === 'product_name'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>
                                Product pic
                            </th>
                            <th @click="sortByColumn('product_price')">
                                Price
                                <span v-if="sortBy === 'product_price'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('product_category')">
                                Category
                                <span v-if="sortBy === 'product_category'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('username')">
                                Seller
                                <span v-if="sortBy === 'username'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('age')">
                                Seller Age
                                <span v-if="sortBy === 'age'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('ubicacion')">
                                Seller Location
                                <span v-if="sortBy === 'ubicacion'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('created_at')">
                                Created At
                                <span v-if="sortBy === 'created_at'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('report_count')">
                                Reports
                                <span v-if="sortBy === 'report_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th @click="sortByColumn('like_count')">
                                Likes
                                <span v-if="sortBy === 'like_count'">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th>
                                Is Visible
                            </th>
                            <th>
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in paginatedProducts" :key="index">
                            <td>
                                <small>{{ product.id }}</small>
                            </td>
                            <td>
                                <UserImgComponent :image="product.profile_picture ? product.profile_picture : ''" :username="product.username"/>
                            </td>

                            <td>
                                {{product.product_name}}
                            </td>
                            <td>
                                <ProductImgComponent :image="product.product_url ? product.product_url : ''" :username="product.product_name" :id="product.id"/>
                            </td>
                            <td>${{ product.product_price }}</td>
                            <td>{{ product.product_category }}</td>
                            <td>{{ product.username }}</td>
                            <td>{{ product.age }}</td>
                            <td>{{ product.ubicacion }}</td>
                            <td>{{ new Date(product.created_at).toLocaleDateString('en-GB') }}</td>
                            <td>{{ product.report_count }}</td>
                            <td>{{ product.like_count }}</td>
                            <td><ToggleProductVisibility :productId="product.id" :isVisible="product.is_visible"/> </td>
                            <td> <DeleteProductAd :productId="product.id" /> </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div class="container">
                <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-start bg-light">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(1)">First</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                        </li>
                        <li v-for="page in visiblePages" :key="page" class="page-item"
                            :class="{ active: page === currentPage }">
                            <button class="page-link" @click="changePage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="changePage(totalPages)">Last</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const visibleButtons = 5;
const loading = ref(true);

const sortBy = ref(''); 
const sortDirection = ref('asc'); 

definePageMeta({
  middleware: ["ad"]
})


useSeoMeta({
  title: 'cntProducts',
  description: 'cntProducts',
  robots: 'noindex', 
});

const fetchProducts = async () => {
    const supabase = useSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = Date.now().toString();
    const navbarStore = useNavbarStore();
    const signature = await navbarStore.generateHMACSignature(timestamp);

    const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/products?cntUser=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
            'X-User': JSON.stringify(user),
        },
    });
    const parsed = await response.json();
    products.value = parsed.data.results;
};

onMounted(async () => {
    await fetchProducts().finally(() => (loading.value = false));
});

const updateProducts = (fetchedProducts) => {
    products.value = fetchedProducts;
};

const sortByColumn = (column) => {
    if (sortBy.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = column;
        sortDirection.value = 'asc';
    }

    products.value.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (valA == null) valA = "";
        if (valB == null) valB = "";

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
    });
};

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages = [];
    const half = Math.floor(visibleButtons / 2);
    const startPage = Math.max(1, currentPage.value - half);
    const endPage = Math.min(totalPages.value, startPage + visibleButtons - 1);

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }
    return pages;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
</script>

<style scoped>
.pagination .page-item.active .page-link {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
}

.pagination .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
}

.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}

.table th,
.table td {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
    border-top: 2px solid #dee2e6;
}

.img-thumbnail {
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    max-width: 100%;
    height: auto;
}

th {
    cursor: pointer;
    /* Make headers clickable */
}
</style>