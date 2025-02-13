<template>
    <div>
      <!-- Filter Box -->
      <div class="card mb-4">
        <div class="card-body">
          <button class="button btn rounded" @click="toggleFiltros">
            <h5 class="card-title border-bottom">Busqueda Avanzada</h5>
          </button>
          <form @submit.prevent="fetchFilteredUsers" v-if="toggle">
            <!-- Age Range -->
            <div class="row mb-3">
              <div class="col">
                <label for="minAge" class="form-label">Edad Mínima</label>
                <input type="number" v-model="filters.minAge" class="form-control" id="minAge" placeholder="Min age" />
              </div>
              <div class="col">
                <label for="maxAge" class="form-label">Edad Máxima</label>
                <input type="number" v-model="filters.maxAge" class="form-control" id="maxAge" placeholder="Max age" />
              </div>
            </div>
  
            <!-- Verified Status -->
            <div class="mb-3">
              <label for="verified" class="form-label">Verificado</label>
              <select v-model="filters.verified" class="form-select" id="verified">
                <option value="">Todos</option>
                <option value="1">Verificados</option>
                <option value="0">Sin Verificar</option>
              </select>
            </div>
  
            <!-- Location -->
            <div class="mb-3">
              <label for="ubicacion" class="form-label">Ubicacion</label>
              <select v-model="filters.location" class="form-select" id="location">
                <option value="">Todos</option>
                <option value="Colombia">Colombia</option>
                <option value="España">España</option>
                <option value="Argentina">Argentina</option>
                <option value="Peru">Peru</option>
                <option value="México">México</option>
              </select>
            </div>
  
            <!-- Banned Status -->
            <div class="mb-3">
              <label for="isBanned" class="form-label">Estado de Baneo</label>
              <select v-model="filters.isBanned" class="form-select" id="isBanned">
                <option value="">Todos</option>
                <option value="1">Baneados</option>
                <option value="0">No Baneados</option>
              </select>
            </div>
  
            <!-- Banned Until -->
            <div class="mb-3">
              <label for="bannedUntil" class="form-label">Baneado Hasta</label>
              <input type="date" v-model="filters.bannedUntil" class="form-control" id="bannedUntil" />
            </div>
  
            <!-- Reported Products Count -->
            <div class="row mb-3">
              <div class="col">
                <label for="minReportedProducts" class="form-label">Reported Products (Min)</label>
                <input type="number" v-model="filters.minReportedProducts" class="form-control" id="minReportedProducts" placeholder="Min" />
              </div>
              <div class="col">
                <label for="maxReportedProducts" class="form-label">Reported Products (Max)</label>
                <input type="number" v-model="filters.maxReportedProducts" class="form-control" id="maxReportedProducts" placeholder="Max" />
              </div>
            </div>
  
            <!-- Reported By User Count -->
            <div class="row mb-3">
              <div class="col">
                <label for="minReportedByUser" class="form-label">Reported By User (Min)</label>
                <input type="number" v-model="filters.minReportedByUser" class="form-control" id="minReportedByUser" placeholder="Min" />
              </div>
              <div class="col">
                <label for="maxReportedByUser" class="form-label">Reported By User (Max)</label>
                <input type="number" v-model="filters.maxReportedByUser" class="form-control" id="maxReportedByUser" placeholder="Max" />
              </div>
            </div>
  
            <!-- Blocked By Count -->
            <div class="row mb-3">
              <div class="col">
                <label for="minBlockedBy" class="form-label">Blocked By (Min)</label>
                <input type="number" v-model="filters.minBlockedBy" class="form-control" id="minBlockedBy" placeholder="Min" />
              </div>
              <div class="col">
                <label for="maxBlockedBy" class="form-label">Blocked By (Max)</label>
                <input type="number" v-model="filters.maxBlockedBy" class="form-control" id="maxBlockedBy" placeholder="Max" />
              </div>
            </div>
  
            <!-- Blocked User Count -->
            <div class="row mb-3">
              <div class="col">
                <label for="minBlockedUser" class="form-label">Blocked Users (Min)</label>
                <input type="number" v-model="filters.minBlockedUser" class="form-control" id="minBlockedUser" placeholder="Min" />
              </div>
              <div class="col">
                <label for="maxBlockedUser" class="form-label">Blocked Users (Max)</label>
                <input type="number" v-model="filters.maxBlockedUser" class="form-control" id="maxBlockedUser" placeholder="Max" />
              </div>
            </div>
  
            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary w-100">Buscar</button>
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
          location: "",
          isBanned: "",
          bannedUntil: "",
          minReportedUser: "",
          maxReportedUser: "",
          minReportedByUser: "",
          maxReportedByUser: "",
          minBlockedBy: "",
          maxBlockedBy: "",
          minBlockedUser: "",
          maxBlockedUser: "",
        },
        toggle: false,
      };
    },
    methods: {
      toggleFiltros() {
        this.toggle = !this.toggle;
      },
      async fetchFilteredUsers() {
        const params = new URLSearchParams();
        if (this.filters.minAge) params.append("minAge", this.filters.minAge);
        if (this.filters.maxAge) params.append("maxAge", this.filters.maxAge);
        if (this.filters.verified) params.append("verified", this.filters.verified);
        if (this.filters.location) params.append("ubicacion", this.filters.location);
        if (this.filters.isBanned) params.append("isBanned", this.filters.isBanned);
        if (this.filters.bannedUntil) params.append("bannedUntil", this.filters.bannedUntil);
        if (this.filters.minReportedUser) params.append("minReportedProducts", this.filters.minReportedUser);
        if (this.filters.maxReportedUser) params.append("maxReportedProducts", this.filters.maxReportedUser);
        if (this.filters.minReportedByUser) params.append("minReportedByUser", this.filters.minReportedByUser);
        if (this.filters.maxReportedByUser) params.append("maxReportedByUser", this.filters.maxReportedByUser);
        if (this.filters.minBlockedBy) params.append("minBlockedBy", this.filters.minBlockedBy);
        if (this.filters.maxBlockedBy) params.append("maxBlockedBy", this.filters.maxBlockedBy);
        if (this.filters.minBlockedUser) params.append("minBlockedUser", this.filters.minBlockedUser);
        if (this.filters.maxBlockedUser) params.append("maxBlockedUser", this.filters.maxBlockedUser);
  
        try {
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
          this.$emit("update-users", parsed.data.results);
        } catch (error) {
          this.$emit("update-users", []);
        }
      },
    },
  };
  </script>