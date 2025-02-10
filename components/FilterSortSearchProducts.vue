<template>
    <div class="container-fluid">
        <!-- Search Bar -->
        <div class="d-flex justify-content-center gap-2">
            <div class="row mb-3">
                <div class="col">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search products...">
                        <button class="btn btn-outline-secondary" @click="fetchProducts">
                            <i class="bi bi-filter"></i> Buscar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filter Modal -->
            <button type="button" class="compBtn btn btn-secondary text-light p-2" data-bs-toggle="modal"
                data-bs-target="#filtersModal">
                Filtros
            </button>
            <div class="modal fade" id="filtersModal" tabindex="-1">
                <div class="modal-dialog d-flex justify-contnet-center w-100">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>Filters</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <!-- Basic Filters -->
                            <div class="mb-3">
                                <label class="form-label">Category</label>
                                <select class="form-select" v-model="filters.product_category">
                                    <option value="">All</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <!-- Price Range -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Min Price</label>
                                    <input type="number" class="form-control" v-model="filters.minPrice">
                                </div>
                                <div class="col">
                                    <label class="form-label">Max Price</label>
                                    <input type="number" class="form-control" v-model="filters.maxPrice">
                                </div>
                            </div>

                            <!-- Seller Location -->
                            <div class="mb-3">
                                <label class="form-label">Seller Location</label>
                                <select class="form-select" v-model="filters.ubicacion">
                                    <option value="">All</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="España">España</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Peru">Peru</option>
                                    <option value="México">México</option>
                                </select>
                            </div>

                            <!-- Seller Age Range -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Seller Min Age</label>
                                    <input type="number" class="form-control" v-model="filters.minAge">
                                </div>
                                <div class="col">
                                    <label class="form-label">Seller Max Age</label>
                                    <input type="number" class="form-control" v-model="filters.maxAge">
                                </div>
                            </div>

                            <!-- Report Counts -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Report Count</label>
                                    <div class="d-flex gap-2">
                                        <input type="number" class="form-control" v-model="filters.minReports"
                                            placeholder="Min">
                                        <input type="number" class="form-control" v-model="filters.maxReports"
                                            placeholder="Max">
                                    </div>
                                </div>
                            </div>

                            <!-- Like Counts -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Like Count</label>
                                    <div class="d-flex gap-2">
                                        <input type="number" class="form-control" v-model="filters.minLikes"
                                            placeholder="Min">
                                        <input type="number" class="form-control" v-model="filters.maxLikes"
                                            placeholder="Max">
                                    </div>
                                </div>
                            </div>

                            <!-- Created At Range -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Created After</label>
                                    <input type="date" class="form-control" v-model="filters.minCreatedAt">
                                </div>
                                <div class="col">
                                    <label class="form-label">Created Before</label>
                                    <input type="date" class="form-control" v-model="filters.maxCreatedAt">
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" @click="closeModal" class="btn btn-primary">Apply Filters</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <!-- Sort Section -->
            <div class="row mb-3">
                <div class="col">
                    <div class="d-flex align-items-center">
                        <span class="me-2">Sort by:</span>
                        <select class="form-select form-select-sm w-auto me-2 p-2" v-model="sortField"
                            @change="setSortField">
                            <option value="product_name">Product Name</option>
                            <option value="product_price">Price</option>
                            <option value="product_category">Category</option>
                            <option value="created_at">Created At</option>
                            <option value="report_count">Report Count</option>
                            <option value="like_count">Like Count</option>
                        </select>
                        <button class="btn btn-sm btn-outline-secondary" @click="toggleSortDirection">
                            <i> {{ sortDirection === 'asc' ? '▲' : '▼' }} </i>
                        </button>
                    </div>
                </div>
            </div>

            <button class="compBtn btn p-2 text-light btn-primary" @click="fetchProducts">Enviar</button>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['update-products'])

const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')
const loading = ref(false)
let params = new URLSearchParams()

const filters = reactive({
    product_category: '',
    minPrice: '',
    maxPrice: '',
    ubicacion: '',
    minAge: '',
    maxAge: '',
    minReports: '',
    maxReports: '',
    minLikes: '',
    maxLikes: '',
    minCreatedAt: '',
    maxCreatedAt: ''
})

function test(e) {
    console.log('test', e.target.value)
    sortField.value = e.target.value
}

const setSortField = (e) => {
    sortField.value = e.target.value
    console.log('set sort value to ', sortField.value)
}

const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const clearAllFilters = () => {
    searchQuery.value = ''
    sortField.value = 'created_at'
    sortDirection.value = 'desc'
    Object.keys(filters).forEach(key => {
        if (typeof filters[key] === 'boolean') {
            filters[key] = false
        } else {
            filters[key] = ''
        }
    })
    params = new URLSearchParams()
}

const fetchProducts = async () => {
    loading.value = true
    applyParams()
    try {
        const supabase = useSupabaseClient()
        const timestamp = Date.now().toString()
        const navbarStore = useNavbarStore()
        const signature = await navbarStore.generateHMACSignature(timestamp)
        const { data: { user } } = await supabase.auth.getUser()

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/products?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        })

        const parsed = await response.json()
        console.log('parsed data', parsed)
        console.log('query', `https://lingerie.fandy8255.workers.dev/api/ad/products?${params.toString()}`)
        emit("update-products", parsed.data.results)
        clearAllFilters()
    } catch (error) {
        console.error("Error:", error)
        emit("update-products", [])
    } finally {
        loading.value = false
    }
}

const closeModal = () => {
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("filtersModal")
    );
    console.log('filters after closing modal', filters)
    modal.hide()
}

const applyParams = () => {
    if (searchQuery.value) params.append('search', searchQuery.value)
    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params.append(key, value)
        }
    })
    params.append('sortBy', sortField.value)
    params.append('sortDirection', sortDirection.value)
    console.log('params before fetch', params)
}
</script>

<style scoped>

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}


.modal-content {
    background: white;
    border-radius: 8px;
    width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
}

.modal-body {
    padding: 1rem;
}

.modal-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
}

.compBtn {
    height: fit-content !important;
}
</style>