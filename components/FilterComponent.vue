<template>
  <div>
    <!-- Filter Box -->
    <div class="card mb-4">
      <div class="card-body">
        <button class="button btn rounded" @click="toggleFiltros">
          <h5 class="card-title border-bottom">Busqueda Avanzada</h5>
        </button>
        <form @submit.prevent="fetchFilteredProducts" v-if="toggle">
          <!-- Product Category -->
          <div class="mb-3">
            <label for="productCategory" class="form-label">Categoría</label>
            <select v-model="filters.product_category" class="form-select" id="productCategory">
              <option value="">Todas</option>
              <option value="contenido">Contenido</option>
              <option value="panties">Panties</option>
              <option value="tangas">Tangas</option>
            </select>
          </div>
          <!-- Price Range -->
          <div class="row mb-3">
            <div class="col">
              <label for="minPrice" class="form-label">Precio Mínimo</label>
              <input type="number" v-model="filters.minPrice" class="form-control" id="minPrice"
                placeholder="Enter min price" />
            </div>
            <div class="col">
              <label for="maxPrice" class="form-label">Precio Máximo</label>
              <input type="number" v-model="filters.maxPrice" class="form-control" id="maxPrice"
                placeholder="Enter max price" />
            </div>
          </div>
          <!-- Age Range -->
          <div class="row mb-3">
            <div class="col">
              <label for="minAge" class="form-label">Edad Minima</label>
              <input type="number" v-model="filters.minAge" class="form-control" id="minAge"
                placeholder="Enter min age" />
            </div>
            <div class="col">
              <label for="maxAge" class="form-label">Edad Máxima</label>
              <input type="number" v-model="filters.maxAge" class="form-control" id="maxAge"
                placeholder="Enter max age" />
            </div>
          </div>

          <div class="row mb-3">
            <label for="ubicacion" class="form-label">Ubicacion</label>
            <select v-model="filters.ubicacion" class="form-select" id="ubicacion">
              <option value="">Todas</option>
              <option value="Colombia">Colombia</option>
              <option value="Peru">Peru</option>
              <option value="Argentina">Argentina</option>
              <option value="España">España</option>
            </select>
          </div>
          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100">Aplicar Filtros</button>
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
        ubicacion: ""
      },
      toggle: false
    };
  },
  methods: {

    toggleFiltros() {
      this.toggle = !this.toggle;
    },

    async fetchFilteredProducts() {
      // Build query parameters
      const params = new URLSearchParams();
      if (this.filters.product_category) params.append("product_category", this.filters.product_category);
      if (this.filters.minPrice) params.append("minPrice", this.filters.minPrice);
      if (this.filters.maxPrice) params.append("maxPrice", this.filters.maxPrice);
      if (this.filters.minAge) params.append("minAge", this.filters.minAge);
      if (this.filters.maxAge) params.append("maxAge", this.filters.maxAge);
      if (this.filters.ubicacion) params.append("ubicacion", this.filters.ubicacion);

      try {
        const timestamp = Date.now().toString();
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch(`https://lingerie.fandy8255.workers.dev/api/filter_products?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `HVAC ${signature}`,
            'X-Timestamp': timestamp,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const parsed = await response.json();

        this.$emit("update-products", parsed.data); 
      } catch (error) {
        
        this.$emit("update-products", []); 
      }
    },
  },
};
</script>