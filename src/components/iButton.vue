<script setup>


// Define props for the component
defineProps({
    text: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    }
});
</script>

<template>
    <!-- Use router-link for better Vue routing -->
    <router-link :to="href" class="block w-max">
        <button type="button" class="px-2 py-1 bg-zinc-100 text-sm text-zinc-800 font-semibold rounded-md
                   hover:bg-zinc-600 hover:text-zinc-100 border border-transparent
                   focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2
                   transition duration-300 ease-in-out" :aria-label="`Navigate to ${text}`">
            {{ text }}
        </button>
    </router-link>
</template>

<style scoped>
/* Custom styles if needed */
</style>
