<template>
  <div>
    <!-- Filter Box -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Filter Products</h5>
        <form @submit.prevent="fetchFilteredProducts">
          <!-- Product Category -->
          <div class="mb-3">
            <label for="productCategory" class="form-label">Product Category</label>
            <select v-model="filters.product_category" class="form-select" id="productCategory">
              <option value="">All</option>
              <option value="contenido">Contenido</option>
              <option value="panties">Panties</option>
              <option value="tangas">Tangas</option>
            </select>
          </div>
          <!-- Price Range -->
          <div class="row mb-3">
            <div class="col">
              <label for="minPrice" class="form-label">Min Price</label>
              <input
                type="number"
                v-model="filters.minPrice"
                class="form-control"
                id="minPrice"
                placeholder="Enter min price"
              />
            </div>
            <div class="col">
              <label for="maxPrice" class="form-label">Max Price</label>
              <input
                type="number"
                v-model="filters.maxPrice"
                class="form-control"
                id="maxPrice"
                placeholder="Enter max price"
              />
            </div>
          </div>
          <!-- Age Range -->
          <div class="row mb-3">
            <div class="col">
              <label for="minAge" class="form-label">Min Seller Age</label>
              <input
                type="number"
                v-model="filters.minAge"
                class="form-control"
                id="minAge"
                placeholder="Enter min age"
              />
            </div>
            <div class="col">
              <label for="maxAge" class="form-label">Max Seller Age</label>
              <input
                type="number"
                v-model="filters.maxAge"
                class="form-control"
                id="maxAge"
                placeholder="Enter max age"
              />
            </div>
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
        product_category: "",
        minPrice: "",
        maxPrice: "",
        minAge: "",
        maxAge: "",
      },
    };
  },
  methods: {
    async fetchFilteredProducts() {
      // Build query parameters
      const params = new URLSearchParams();
      if (this.filters.product_category) params.append("product_category", this.filters.product_category);
      if (this.filters.minPrice) params.append("minPrice", this.filters.minPrice);
      if (this.filters.maxPrice) params.append("maxPrice", this.filters.maxPrice);
      if (this.filters.minAge) params.append("minAge", this.filters.minAge);
      if (this.filters.maxAge) params.append("maxAge", this.filters.maxAge);

      try {
        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/products?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const parsed = await response.json();
        console.log('parsed filtered', parsed)
        console.log('parsed results', parsed.data.results)
        // Emit fetched products to the parent component
        this.$emit("update-products", parsed.data.results); // Emit fetched data
      } catch (error) {
        console.error("Error fetching products:", error.message);
        this.$emit("update-products", []); // Emit empty array on error
      }
    },
  },
};
</script>