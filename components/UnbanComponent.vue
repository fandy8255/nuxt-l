<template>
    <div>
        <!-- Unban Button -->
        <button type="button" class="btn btn-sm btn-success text-light" data-bs-toggle="modal"
            :data-bs-target="`#${modalId}_${userId}`">
            Unban
        </button>

        <!-- Unban Modal -->
        <div class="modal fade" :id="`${modalId}_${userId}`" tabindex="-1" aria-labelledby="unbanUserModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="unbanUserModalLabel">
                            Unban User
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to unban this user?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" @click="unbanUser">Unban User</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const modalId = 'unbanUserModal';
const navbarStore = useNavbarStore();
const { userId } = defineProps(['userId']);

const unbanUser = async () => {
    try {
        const timestamp = Date.now().toString();
        const signature = await navbarStore.generateHMACSignature(timestamp);
        const user=await navbarStore.getUser()

        const response = await fetch(
            'https://lingerie.fandy8255.workers.dev/api/ad/unban-user',
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
                }),
            }
        );

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(
                document.getElementById(`${modalId}_${userId}`)
            );
            modal.hide();
        } else {
        }
    } catch (error) {
    }
};
</script>

<style>
.modal-backdrop {
    z-index: 10 !important;
}
</style>