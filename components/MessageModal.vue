<template>
    <div v-if="message" class="modal-backdrop">
      <div
        class="modal-dialog"
        :class="{ 'modal-success': message.success, 'modal-failure': message.failure }"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ message.success ? 'Éxito' : 'Error' }}
            </h5>
            <button type="button" class="btn-close" @click="$emit('clear')" />
          </div>
          <div class="modal-body">
            <p>{{ message.text }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="$emit('clear')">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: Object,
      required: true,
    },
  });
  
  defineEmits(['clear']);
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }
  
  .modal-dialog {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    padding: 1rem;
  }
  
  .modal-success {
    border-left: 4px solid green;
  }
  
  .modal-failure {
    border-left: 4px solid red;
  }
  </style>