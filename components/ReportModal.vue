<template>
    <!-- Bootstrap 5 Modal -->
    <div>
        <button @click="toggleModal" type="button" class="btn btn-sm btn-danger text-light">
            Reportar
        </button>

        <div class="modal d-block" v-if="showModal" tabindex="-1" :id="`report_${productId}`">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reportar Producto</h5>
                        <button type="button" @click="toggleModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <form @submit.prevent="submitReport">
                            <!-- Select Report Reason -->
                            <div class="mb-3">
                                <label for="reason" class="form-label">Motivo del Reporte</label>
                                <select v-model="reportReason" id="reason" class="form-select" required>
                                    <option value="Contenido irrelevante">Contenido irrelevante</option>
                                    <option value="En contra de nuestros términos de uso">En contra de nuestros términos
                                        de
                                        uso</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <!-- Custom Report Reason (Only if "Otro" is selected) -->
                            <div v-if="reportReason === 'Otro'" class="mb-3">
                                <label for="customReason" class="form-label">Especificar Razón</label>
                                <textarea v-model="customReason" id="customReason" class="form-control" rows="3"
                                    required minlength="50" maxlength="100"></textarea>
                                <small class="text-muted">{{ customReason.length }}/100 caracteres</small>
                            </div>

                            <!-- Submit & Cancel Buttons -->
                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-danger">Enviar Reporte</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    productId: String,
    reporterId: Number,
    reportedId: Number,
});

const showModal = ref(false)

const toggleModal = () => {
    showModal.value = !showModal.value
}

const reportReason = ref('');
const customReason = ref('');
const userStore = useUserStore();

const submitReport = async () => {
    const reason = reportReason.value === 'Otro' ? customReason.value : reportReason.value;

    if (reportReason.value === 'Otro' && (customReason.value.length < 50 || customReason.value.length > 100)) {
        alert('La razón debe tener entre 50 y 100 caracteres.');
        return;
    }

    try {
        const timestamp = Date.now().toString(); 
        const signature = await userStore.generateHMACSignature(timestamp);

        const response = await fetch('https://lingerie.fandy8255.workers.dev/api/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `HVAC ${signature}`,
                'X-Timestamp': timestamp,
            },
            body: JSON.stringify({
                product_id: props.productId,
                reporter_id: props.reporterId,
                reported_id: props.reportedId,
                report_reason: reason,
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Reporte enviado correctamente.');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Hubo un error. Inténtalo nuevamente.');
    }

    toggleModal();
};
</script>

<style></style>