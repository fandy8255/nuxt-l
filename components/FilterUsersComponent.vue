<template>
  <div>
    <!-- Filter Box -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Filter Users</h5>
        <form @submit.prevent="fetchFilteredUsers">
          <!-- Age Range -->
          <div class="row mb-3">
            <div class="col">
              <label for="minAge" class="form-label">Min Age</label>
              <input type="number" v-model="filters.minAge" class="form-control" id="minAge" placeholder="Min age" />
            </div>
            <div class="col">
              <label for="maxAge" class="form-label">Max Age</label>
              <input type="number" v-model="filters.maxAge" class="form-control" id="maxAge" placeholder="Max age" />
            </div>
          </div>

          <!-- Verified Status -->
          <div class="mb-3">
            <label for="verified" class="form-label">Verified</label>
            <select v-model="filters.verified" class="form-select" id="verified">
              <option value="">All</option>
              <option value="1">Verified</option>
              <option value="0">Not Verified</option>
            </select>
          </div>

          <!-- Location -->
          <div class="mb-3">
            <label for="ubicacion" class="form-label">Location</label>
            <!-- <input type="text" v-model="filters.location" class="form-control" id="location" placeholder="Location" />-->
            <select v-model="filters.location" class="form-select" id="location">
              <option value="">Todos</option>
              <option value="Colombia">Colombia</option>
              <option value="España">España</option>
              <option value="Argentina">Argentina</option>
              <option value="Peru">Peru</option>
              <option value="México">México</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100">Apply Filters</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        minAge: "",
        maxAge: "",
        verified: "",
        ubicacion: "",
      },
      runtimeConfig: null, // Define a placeholder for runtimeConfig
    };
  },
  created() {
    // Use useRuntimeConfig to initialize runtimeConfig
    this.runtimeConfig = useRuntimeConfig();
  },
  methods: {
    async fetchFilteredUsers() {
      const params = new URLSearchParams();
      if (this.filters.minAge) params.append("minAge", this.filters.minAge);
      if (this.filters.maxAge) params.append("maxAge", this.filters.maxAge);
      if (this.filters.verified) params.append("verified", this.filters.verified);
      if (this.filters.location) params.append("ubicacion", this.filters.location);

      try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/users?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${this.runtimeConfig.public.secretApiKey}`, // Access the runtimeConfig here
          },
        });

        const parsed = await response.json();
        this.$emit("update-users", parsed.data.results);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        this.$emit("update-users", []);
      }
    },
  },
};
</script>