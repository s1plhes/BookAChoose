<!-- src/components/ErrorMessage.vue -->
<script setup>
import { ref, watch } from 'vue'

// Definir las props
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success' // Tipo de mensaje: 'error', 'warning', 'info', etc.
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
      class="bg-green-500 border-green-400 text-slate-100 px-4 py-3 my-3 rounded border"
      role="alert"
    >
      <strong class="font-bold text-center">Yay!</strong>
      <span class="block sm:inline">{{ message }}.</span>
      <button @click="closeMessage" class="ml-2 text-white">x</button>
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
