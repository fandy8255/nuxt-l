
<template>
    <div class="container-fluid">
        <!-- Search Bar -->
        <div class="row mb-3">
            <div class="col">
                <div class="input-group">
                    <input type="text" class="form-control" v-model="searchQuery"
                        placeholder="Search users...">
                    <button class="btn btn-outline-secondary" @click="openFiltersModal">
                        <i class="bi bi-filter"></i> Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Sorting Dropdown -->
        <div class="row mb-3">
            <div class="col">
                <div class="d-flex align-items-center">
                    <span class="me-2">Sort by:</span>
                    <select class="form-select form-select-sm w-auto me-2" v-model="sortField" @change="applyFilters">
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
                        <i :class="sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                    </button>
                </div>
            </div>
        </div>


        <!-- Filters Modal -->
        <button type="button" class="btn btn-sm btn-danger text-light" data-bs-toggle="modal"
            data-bs-target="#filtersModal">
            Filtros
        </button>
        <div class="modal fade" id="filtersModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">User Filters</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-control" v-model="filters.location">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <label class="form-label">Age Range</label>
                                <div class="d-flex">
                                    <input type="number" class="form-control me-2" v-model.number="filters.minAge"
                                        placeholder="Min Age">
                                    <input type="number" class="form-control" v-model.number="filters.maxAge"
                                        placeholder="Max Age">
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="filters.verified"
                                        id="verifiedCheck">
                                    <label class="form-check-label" for="verifiedCheck">
                                        Verified Users Only
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="filters.isBanned"
                                        id="bannedCheck">
                                    <label class="form-check-label" for="bannedCheck">
                                        Banned Users Only
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="button" class="btn btn-primary" @click="applyFilters" data-bs-dismiss="modal">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State management
const loading = ref(false)
const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')

const emit = defineEmits(['update-users'])

const filters = reactive({
    location: '',
    minAge: null,
    maxAge: null,
    verified: false,
    isBanned: false
})


// Toggle sort direction
const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    applyFilters()
}

// Fetch users with current filters
const fetchUsers = async () => {
    loading.value = true
    try {
        const params = new URLSearchParams()

        // Add search query
        if (searchQuery.value) {
            params.append('search', searchQuery.value)
        }

        // Add location filter
        if (filters.location) {
            params.append('ubicacion', filters.location)
        }

        // Add age filters
        if (filters.minAge) {
            params.append('minAge', filters.minAge)
        }
        if (filters.maxAge) {
            params.append('maxAge', filters.maxAge)
        }

        // Add verified filter
        if (filters.verified) {
            params.append('verified', 'true')
        }

        // Add banned filter
        if (filters.isBanned) {
            params.append('isBanned', '1')
        }

        // Add sorting
        params.append('sortBy', sortField.value)
        params.append('sortDirection', sortDirection.value)


        const supabase = useSupabaseClient();
        const timestamp = Date.now().toString();
        const navbarStore = useNavbarStore();
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const { data: { user } } = await supabase.auth.getUser();

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/ad/users?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
                'X-User': JSON.stringify(user),
            },
        });

        const parsed = await response.json();
        console.log(`https://lingerie.fandy8255.workers.dev/api/ad/users?${params.toString()}`)
        console.log('parsed advanced filtered', parsed);
        emit("update-users", parsed.data.results);

        //const response = await fetch(`/api/ad/users?${params.toString()}`)
        //const data = await response.json()
        //users.value = data.data

    } catch (error) {
        console.error("Error fetching users:", error.message);
        this.$emit("update-users", []);
    } finally {
        loading.value = false
    }
}

// Debounced search to reduce API calls
//const debouncedSearch = debounce(fetchUsers, 500)

// Apply filters and trigger fetch
const applyFilters = () => {
    fetchUsers()
}

// Initial data fetch
onMounted(() => {
    //fetchUsers()
})
</script>

<style scoped>

</style>