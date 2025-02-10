<template>
    <div class="container-fluid">
        <!-- Search Bar -->
        <div class="d-flex justify-content-center gap-2">
            <div class="row mb-3">
                <div class="col">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search users...">
                        <button class="btn btn-outline-secondary" @click="fetchUsers">
                            <i class="bi bi-filter"></i> Buscar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filter Modal -->
            <button  type="button" class="compBtn btn btn-secondary text-light p-2" data-bs-toggle="modal"
                data-bs-target="#filtersModal">
                Filtros
            </button>
            <div class="modal fade" id="filtersModal" tabindex="-1">
                <div class="modal-dialog d-flex justify-contnet-center w-100">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>Filters</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            
                                <!-- Basic Filters -->
                                <div class="mb-3">
                                    <label class="form-label">Location</label>
                                    <select class="form-select" v-model="filters.location">
                                        <option value="">All</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="España">España</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Peru">Peru</option>
                                        <option value="México">México</option>
                                    </select>
                                </div>

                                <!-- Age Range -->
                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Min Age</label>
                                        <input type="number" class="form-control" v-model="filters.minAge">
                                    </div>
                                    <div class="col">
                                        <label class="form-label">Max Age</label>
                                        <input type="number" class="form-control" v-model="filters.maxAge">
                                    </div>
                                </div>

                                <!-- Status Filters -->
                                <div class="mb-3">
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" v-model="filters.verified"
                                            id="verifiedCheck">
                                        <label class="form-check-label" for="verifiedCheck">Verified Users</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="filters.isBanned"
                                            id="bannedCheck">
                                        <label class="form-check-label" for="bannedCheck">Banned Users</label>
                                    </div>
                                </div>

                                <!-- Report Counts -->
                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Reported By Users</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control"
                                                v-model="filters.minReportedByUser" placeholder="Min">
                                            <input type="number" class="form-control"
                                                v-model="filters.maxReportedByUser" placeholder="Max">
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">User Reports</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control" v-model="filters.minReportedUser"
                                                placeholder="Min">
                                            <input type="number" class="form-control" v-model="filters.maxReportedUser"
                                                placeholder="Max">
                                        </div>
                                    </div>
                                </div>

                                <!-- Block Counts -->
                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Blocked By Count</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control" v-model="filters.minBlockedBy"
                                                placeholder="Min">
                                            <input type="number" class="form-control" v-model="filters.maxBlockedBy"
                                                placeholder="Max">
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Blocked Users Count</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control" v-model="filters.minBlockedUser"
                                                placeholder="Min">
                                            <input type="number" class="form-control" v-model="filters.maxBlockedUser"
                                                placeholder="Max">
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Threads Count</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control" v-model="filters.minThreadsCount"
                                                placeholder="Min">
                                            <input type="number" class="form-control" v-model="filters.maxThreadsCount"
                                                placeholder="Max">
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col">
                                        <label class="form-label">Products Count</label>
                                        <div class="d-flex gap-2">
                                            <input type="number" class="form-control" v-model="filters.minProductsCount"
                                                placeholder="Min">
                                            <input type="number" class="form-control" v-model="filters.maxProductsCount"
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
                        <select class="form-select form-select-sm w-auto me-2 p-2" v-model="sortField" @change="setSortField">
                            <option value="age">Age</option>
                            <option value="created_at">Created At</option>
                            <option value="reported_by_user_count">Reported By Users</option>
                            <option value="reported_user_count">User Reports</option>
                            <option value="blocked_by_count">Blocked By</option>
                            <option value="blocked_user_count">User Blocks</option>
                            <option value="product_count">Product Count</option>
                            <option value="thread_count">Thread Count</option>
                        </select>
                        <button class="btn btn-sm btn-outline-secondary" @click="toggleSortDirection">
                            <i> {{ sortDirection === 'asc' ? '▲' : '▼' }} </i>
                        </button>
                    </div>
                </div>
            </div>

            <button class="compBtn btn p-2 text-light btn-primary" @click="fetchUsers">Enviar</button>

        </div>


    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const emit = defineEmits(['update-users'])

const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')
const loading = ref(false)
let params = new URLSearchParams()

const filters = reactive({
    location: '',
    minAge: '',
    maxAge: '',
    verified: false,
    isBanned: false,
    minReportedByUser: '',
    maxReportedByUser: '',
    minReportedUser: '',
    maxReportedUser: '',
    minBlockedBy: '',
    maxBlockedBy: '',
    minBlockedUser: '',
    maxBlockedUser: '',
    minThreadsCount:'',
    maxThreadsCount:'',
    minProductsCount:'',
    maxProductsCount:'',
    bannedUntil: ''
})

function test(e){
    console.log('test', e.target.value)
    sortField.value=e.target.value
}

const setSortField = (e) => {
    //sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    sortField.value=e.target.value
    console.log('set sort value to ', sortField.value)
    //applyFilters()
}

const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    //params.append('sortDirection', sortDirection.value)
    //applyFilters()
}

const clearAllFilters = () => {
    // Clear search query
    searchQuery.value = ''
    
    // Reset sort fields
    sortField.value = 'created_at'
    sortDirection.value = 'desc'
    
    // Clear all filters
    Object.keys(filters).forEach(key => {
        if (typeof filters[key] === 'boolean') {
            filters[key] = false
        } else {
            filters[key] = ''
        }
    })

    console.log('clearing all filter search', searchQuery.value)
    console.log('clearing all filter filter', filters)
    //console.log('clearing all filter search', searchQuery.value)
    
    // Clear URL parameters
    params= new URLSearchParams()
}

const fetchUsers = async () => {
    loading.value = true
    //if (searchQuery.value) params.append('search', searchQuery.value)
    applyParams()
    try {
        const supabase = useSupabaseClient()
        const timestamp = Date.now().toString()
        const navbarStore = useNavbarStore()
        const signature = await navbarStore.generateHMACSignature(timestamp)
        const { data: { user } } = await supabase.auth.getUser()

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/users?${params.toString()}`, {
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
        console.log('query', `https://lingerie.fandy8255.workers.dev/api/ad/users?${params.toString()}`)
        emit("update-users", parsed.data.results)
        clearAllFilters()
        //params=new URLSearchParams()
    } catch (error) {
        console.error("Error:", error)
        emit("update-users", [])
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
        const paramKey = key === 'location' ? 'ubicacion' : key
        params.append(paramKey, value)
    }
})
params.append('sortBy', sortField.value)
params.append('sortDirection', sortDirection.value)

console.log('params before fetch', params)

}


</script>

<style scoped>

/*
#filtersModal{
    width: 70vw;
}*/

/*
#content-modal{
    background: white;
    border-radius: 8px;
    max-width: 100vw !important;
    width: 100vw;
    max-height: 90vh;
    overflow-y: auto;
}
*/
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

.compBtn{
    height: fit-content !important ;
}
</style>