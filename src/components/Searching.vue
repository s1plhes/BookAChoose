<template>
    <div class="relative w-full max-w-md mx-auto">
        <input type="text" v-model="query" @input="handleSearch"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Search for books or authors..." />
        <div v-if="results.length > 0"
            class="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto w-full">
            <ul>
                <li v-for="result in results" :key="result.book_id || result.user_id" @click="selectResult(result)"
                    class="p-2 hover:bg-blue-500 hover:text-black cursor-pointer">
                    {{ result.book_title || result.user_name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const query = ref('');
const results = ref([]);

const handleSearch = async () => {
    if (query.value.length < 3) {
        results.value = [];
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/search?q=${query.value}`);
        results.value = response.data;
    } catch (error) {
        console.error('Search error:', error);
        results.value = [];
    }
};

const selectResult = (result) => {
    query.value = result.book_title || result.user_name;
    results.value = [];
    // Here you could also handle the selected result, like redirecting or showing more details
};
</script>

<style scoped>
/* Optional Tailwind CSS customization */
</style>