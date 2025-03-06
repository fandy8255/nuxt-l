<template>
    <div>
        <!-- Comprar Button -->
        <button class="btn btn-primary" @click="openModal">
            Comprar
        </button>

        <!-- Modal -->
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal-content">
                <!-- Close Button -->
                <div class="container text-end">
                    <button class="btn btn-md bg-danger text-light p-1" @click="closeModal">Cerrar</button>
                </div>
                
                <!-- Purchase Status Bar -->
                <div class="purchase-status-bar mb-4">
                    <div v-for="(stage, index) in stages" :key="index"
                        :class="['status-step fw-bold lead text-muted', { 'active': currentStage === index, 'completed': currentStage > index }]">
                        {{ stage }}
                    </div>
                </div>

                <!-- Stage 1: Update Personal Information -->
                <div v-if="currentStage === 0" class="stage-content">
                    <h3 class="mb-4 fw-bolder text-start">Información de Envío</h3>
                    <form @submit.prevent="nextStage">
                        <div class="mb-3 text-start">
                            <label for="fullName" class="form-label fw-bold">Nombre Completo</label>
                            <input type="text" class="form-control" id="fullName" v-model="formData.fullName" required
                                placeholder="Ingresa tu nombre completo" />
                        </div>
                        <div class="mb-3 text-start">
                            <label for="address" class="form-label fw-bold">Dirección</label>
                            <input type="text" class="form-control" id="address" v-model="formData.shipping_address"
                                required placeholder="Ingresa tu dirección" />
                        </div>
                        <div class="mb-3 text-start">
                            <label for="zipcode" class="form-label fw-bold">Código Postal</label>
                            <input type="text" class="form-control" id="zipcode" v-model="formData.shipping_zipcode"
                                required placeholder="Ingresa tu código postal" />
                        </div>
                        <div class="mb-3 text-start">
                            <label for="country" class="form-label fw-bold">País</label>
                            <input type="text" class="form-control" id="country" v-model="formData.shipping_country"
                                required placeholder="Ingresa tu país" />
                        </div>
                        <div class="mb-3 text-start">
                            <label for="department" class="form-label fw-bold">Departamento/Municipalidad</label>
                            <input type="text" class="form-control" id="department"
                                v-model="formData.shipping_municipality" required
                                placeholder="Ingresa tu departamento o municipalidad" />
                        </div>
                        <button type="submit" class="btn btn-secondary w-100 text-light">Siguiente</button>
                    </form>
                </div>

                <!-- Stage 2: Review Product Details -->
                <div v-if="currentStage === 1" class="stage-content">
                    <h3 class="mb-4 fw-bolder text-start">Revisar Detalles de la Orden</h3>
                    <div class="container d-flex gap-2">
                        <div class="row w-100">
                            <div class="mb-1 text-start col-6">
                                <label for="paymentMethod" class="form-label fw-bold">Método de Pago</label>
                                <select class="form-select" id="paymentMethod" v-model="formData.payment_method"
                                    required>
                                    <option value="paypal">PayPal</option>
                                    <option value="binance">Binance</option>
                                    <option value="acordado">Acuerdo con vendedor</option>
                                </select>
                                <div class="quantity-price mb-3">
                                    <label for="quantity" class="form-label fw-bold">Cantidad:</label>
                                    <input type="number" class="form-control" id="quantity" v-model="formData.quantity"
                                        min="1" required />
                                    <p class="mt-2 fw-bold">Precio: ${{ product.product_price * formData.quantity }}</p>
                                </div>
                            </div>
                            <div class="col-6">
                                <div>
                                    <NuxtImg provider="bunny" :src="product.product_url" height="auto" width="300px"
                                        :quality="50" placeholder="/assets/images/panty-icon.png" />
                                    <h4>{{ product.product_name }}</h4>
                                    <p class="text-muted">{{ product.product_description }}</p>
                                </div>

                            </div>

                        </div>

                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-secondary text-light" @click="prevStage">Anterior</button>
                        <button class="btn btn-secondary text-light" @click="nextStage">Siguiente</button>
                    </div>
                </div>

                <!-- Stage 3: Confirmation -->
                <div v-if="currentStage === 2" class="stage-content">
                    <h3 class="mb-4">Confirmar Compra</h3>
                    <p>He acordado el método de pago con el vendedor y deseo seguir con la compra.</p>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" v-model="formData.agreeToTerms" required />
                        <label class="form-check-label">Acepto los términos</label>
                    </div>
                    <div class="mb-3 text-start">
                        <label for="notes" class="form-label">Notas Adicionales</label>
                        <textarea class="form-control" id="notes" v-model="formData.notes"
                            placeholder="Ingresa notas adicionales (opcional)"></textarea>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-secondary text-light" @click="prevStage">Anterior</button>
                        <button class="btn btn-primary text-light" :disabled="!formData.agreeToTerms" @click="submitOrder">
                            Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    product: Object,
    user: Object,
});

const emit = defineEmits(['submit-order']);

const isModalOpen = ref(false);
const currentStage = ref(0);
const stages = ['Información', 'Detalles', 'Confirmación'];

const formData = ref({
    fullName: '',
    shipping_address: '',
    shipping_zipcode: '',
    shipping_country: '',
    shipping_municipality: '',
    quantity: 1,
    payment_method: 'acordado', // Default value
    agreeToTerms: false,
    notes: '',
});

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    currentStage.value = 0; // Reset to the first stage
};

const nextStage = () => {
    if (currentStage.value < stages.length - 1) {
        currentStage.value++;
    }
};

const prevStage = () => {
    if (currentStage.value > 0) {
        currentStage.value--;
    }
};

const submitOrder = () => {
    const orderData = {
        buyer_id: props.user.id,
        seller_id: props.product.user_id,
        product_id: props.product.id,
        quantity: formData.value.quantity,
        total_price: props.product.product_price * formData.value.quantity,
        payment_method: formData.value.payment_method,
        shipping_country: formData.value.shipping_country,
        shipping_municipality: formData.value.shipping_municipality,
        shipping_address: formData.value.shipping_address,
        shipping_zipcode: formData.value.shipping_zipcode,
        notes: formData.value.notes,
    };
    emit('submit-order', orderData);
    closeModal();
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: rgb(240, 240, 240);
    padding: 20px;
    border-radius: 8px;
    /*width: 90%;
    max-width: 500px;*/
    max-width: 60vw;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.purchase-status-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.status-step {
    flex: 1;
    text-align: center;
    padding: 10px;
    border-bottom: 2px solid #ccc;
    color: #ccc;
}

.status-step.active {
    border-bottom-color: #2f2f2f;
    color: #2f2f2f;
    /*
    border-bottom-color: #007bff;
    color: #007bff;*/
}

.status-step.completed {
    border-bottom-color: #28a745;
    color: #28a745;
}

.stage-content {
    text-align: center;
}

.product-details {
    margin-bottom: 20px;
}

.product-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.quantity-price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
}

.btn {
    margin: 5px;
}
</style>