<!-- src/components/ErrorMessage.vue -->
<script setup>
import { ref, watch } from 'vue'

// Definir las props
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'error' // Tipo de mensaje: 'error', 'warning', 'info', etc.
  },
  autoClose: {
    type: Boolean,
    default: false // Cerrar automáticamente
  },
  autoCloseDelay: {
    type: Number,
    default: 5000 // Tiempo de cierre automático en milisegundos
  }
})

// Estado para mostrar/ocultar el mensaje
const isVisible = ref(true)

// Función para cerrar el mensaje manualmente
const closeMessage = () => {
  isVisible.value = false
}

// Cerrar automáticamente después de un tiempo si está habilitado
if (props.autoClose) {
  setTimeout(() => {
    closeMessage()
  }, props.autoCloseDelay)
}

// Monitorear el mensaje para resetear la visibilidad cuando cambie
watch(
  () => props.message,
  (newVal) => {
    if (newVal) {
      isVisible.value = true
    }
  }
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="isVisible && message"
      :class="{
        'bg-red-800/70 border-red-950': type === 'error',
        'bg-yellow-500 border-yellow-700': type === 'warning',
        'bg-blue-500 border-blue-700': type === 'info',
        'bg-green-500 border-blue-700': type === 'success'
      }"
      class="text-slate-100 px-4 py-3 my-3 rounded border"
      role="alert"
    >
      <strong class="font-bold text-center">{{ type === 'error' ? 'Oh no!' : '' }}</strong>
      <p v-if="type === 'error'">We received an error, if this persists contact support</p>
      <p v-if="type === 'success'">Yeah!</p>
      <span v-if="type === 'error'" class="block sm:inline">{{ message }}.</span>
      <span v-if="type === 'success'" class="block sm:inline">{{ message }}.</span>
      <button @click="closeMessage" class="ml-2 text-white">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    </div>
  </transition>
</template>

<style>
/* Añadir una animación suave para mostrar/ocultar el mensaje */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
