<!-- eslint-disable vue/multi-word-component-names -->
<!-- Notification.vue -->
<template>
    <div v-if="visible" class="fixed top-4 right-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
        {{ message }}
    </div>
</template>

<script setup>
defineProps({
    message: String,
    visible: Boolean,
});
</script>

<style scoped>
/* Estilos opcionales */
</style>