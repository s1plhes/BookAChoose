<script setup>

import { defineEmits } from 'vue';

// Define the props for the component
const props = defineProps({
    // showModal is a Boolean prop that is required
    showModal: { type: Boolean, required: true },
    // title is a String prop that is required
    title: { type: String, required: true },
});

// Define the events that can be emitted by the component
const emit = defineEmits(['update:showModal']);


const closeModal = () => {
    // Emit the 'update:showModal' event with a value of false to close the modal
    emit('update:showModal', false);
};
</script>

<template>
    <transition name="fade">
        <div v-if="props.showModal" class="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-40 ">
            <div class="bg-slate-950 backdrop-blur-md backdrop-filter
             p-6 rounded-lg shadow-lg w-full max-w-md relative top-modal ">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-white">{{ props.title }}</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-800">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="mt-4">
                    <slot></slot>
                </div>
                <div class="mt-4 flex justify-end">
                    <Btn variant="danger" @click="closeModal">Close</btn>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.top-modal {}
</style>
