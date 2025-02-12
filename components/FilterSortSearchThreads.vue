<template>
    <div class="container-fluid">
        <!-- Search Bar -->
        <div class="d-flex justify-content-center gap-2">
            <div class="row mb-3">
                <div class="col">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search thread title...">
                        <button class="btn btn-outline-secondary" @click="fetchThreads">
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
                                <label class="form-label">Sender Location</label>
                                <select class="form-select" v-model="filters.senderLocation">
                                    <option value="">All</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="España">España</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Peru">Peru</option>
                                    <option value="México">México</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Receiver Location</label>
                                <select class="form-select" v-model="filters.receiverLocation">
                                    <option value="">All</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="España">España</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Peru">Peru</option>
                                    <option value="México">México</option>
                                </select>
                            </div>

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

                            <div class="mb-3">
                                <label class="form-label">User Type</label>
                                <select class="form-select" v-model="filters.userType">
                                    <option value="">All</option>
                                    <option value="seller">Seller</option>
                                    <option value="buyer">Buyer</option>
                                </select>
                            </div>

                            <!-- Like Counts -->
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Message Count</label>
                                    <div class="d-flex gap-2">
                                        <input type="number" class="form-control" v-model="filters.minMessageCount"
                                            placeholder="Min">
                                        <input type="number" class="form-control" v-model="filters.maxMessageCount"
                                            placeholder="Max">
                                    </div>
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
                            
                            <option value="created_at">Created At</option>
                            <option value="last_updated_at">Last Updated At</option>
                            <option value="message_count">Message Count</option>
                        </select>
                        <button class="btn btn-sm btn-outline-secondary" @click="toggleSortDirection">
                            <i> {{ sortDirection === 'asc' ? '▲' : '▼' }} </i>
                        </button>
                    </div>
                </div>
            </div>

            <button class="compBtn btn p-2 text-light btn-primary" @click="fetchThreads">Enviar</button>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['update-threads'])

const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')
const loading = ref(false)
let params = new URLSearchParams()

const filters = reactive({
    senderLocation: '',
    receiverLocation: '',
    minAge: '',
    maxAge: '',
    userType: '',
    minMessageCount: '',
    maxMessageCount: '',
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

const fetchThreads = async () => {
    loading.value = true
    applyParams()
    try {
        const timestamp = Date.now().toString()
        const navbarStore = useNavbarStore()
        const signature = await navbarStore.generateHMACSignature(timestamp)
        const user = await navbarStore.getUser()

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/threads?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        })

        const parsed = await response.json()
        console.log('parsed data', parsed.data.results)
        console.log('query', `https://lingerie.fandy8255.workers.dev/api/ad/threads?${params.toString()}`)
        emit("update-threads", parsed.data.results)
        clearAllFilters()
    } catch (error) {
        console.error("Error:", error)
        emit("update-threads", [])
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