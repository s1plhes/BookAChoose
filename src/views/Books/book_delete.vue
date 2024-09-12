<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h2>Confirm Delete</h2>
      <p>Type <strong>"sudo delete book"</strong> to confirm.</p>
      <input v-model="confirmationPhrase" type="text" placeholder="Type here..." />

      <div class="modal-actions">
        <button @click="confirmDelete" :disabled="confirmationPhrase !== 'sudo delete book'">
          Delete Book
        </button>
        <button @click="cancelDelete">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  bookId: Number
})

const emit = defineEmits(['deleteConfirmed', 'cancel'])

const confirmationPhrase = ref('')

const confirmDelete = () => {
  emit('deleteConfirmed', props.bookId)
}

const cancelDelete = () => {
  confirmationPhrase.value = ''
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
}

button {
  margin: 5px;
}
</style>
