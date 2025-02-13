<template>
    <div>
        <!-- Ban Button -->
        <button type="button" class="btn btn-sm btn-danger text-light" data-bs-toggle="modal"
            :data-bs-target="`#${modalId}_${userId}`">
            Ban
        </button>

        <!-- Ban Modal -->
        <div class="modal fade" :id="`${modalId}_${userId}`" tabindex="-1" aria-labelledby="banUserModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="banUserModalLabel">
                            Ban User
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="banUser">
                            <div class="mb-3">
                                <label for="banUntilDate" class="form-label">Ban Until</label>
                                <input type="datetime-local" class="form-control" id="banUntilDate" v-model="bannedUntil" required>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-warning">Ban User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const modalId = 'banUserModal';
const navbarStore = useNavbarStore();
const { userId } = defineProps(['userId']);
const runtimeConfig = useRuntimeConfig();
const environment = runtimeConfig.public.dev;

const bannedUntil = ref('');

const banUser = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const user=await navbarStore.getUser()

        const response = await fetch(
            'https://lingerie.fandy8255.workers.dev/api/ad/ban-user',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `HVAC ${signature}`,
                    'X-Timestamp': timestamp,
                    'X-User': JSON.stringify(user), 
                },
                body: JSON.stringify({
                    userId: userId,
                    bannedUntil: bannedUntil.value,
                }),
            }
        );

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById(`${modalId}_${userId}`)
            );
            console.log('modal', modal)
            modal.hide();

        } else {
            console.error('failed to ban')
            
        }
    } catch (error) {
        console.error('Error while banning user:', error.message);
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>