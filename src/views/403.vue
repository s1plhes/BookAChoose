<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex  justify-center min-h-screen">
        <div class="text-center p-8  rounded-lg shadow-lg">
            <h1 class="text-5xl font-bold text-red-500">403</h1>
            <h2 class="text-2xl font-semibold text-slate-100 mt-4">Unauthorized Access</h2>
            <p class="text-gray-400 mt-2">
                Sorry, you do not have permission to view this page.
            </p>
            <button @click="goHome()"
                class="mt-6 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition duration-150">
                Go Home
            </button>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {

    router.push('/')
}
</script>