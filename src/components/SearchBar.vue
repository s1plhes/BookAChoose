<template>
    <div class="relative">
        <input v-model="query" @input="onInput" type="text"
            class="px-4 py-2 w-full border border-slate-700 bg-slate-950 rounded-lg text-white focus:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search..." />
        <button @click="onSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-slate-950 text-white rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
            Search
        </button>
        <div v-if="loading">Loading...</div>
        <Modal class="z-40" :showModal="searchModal" title="SearchResults" @update:showModal="searchModal = $event">
            <div v-if="results.length">
                <p>{{ results.index }}</p>
                <ul class="space-y-4">
                    <li v-for="item in results[0]" :key="item.index" class="gap-x-2 gap-6">
                        <Btn v-if="item.book_id" variant="primary" :href="`/book/${item.book_id}`"> {{
                            item.book_title }} </Btn>
                    </li>
                </ul>

            </div>
            <p v-else>No results found.</p>
        </Modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const query = ref('');
const results = ref([]);
const loading = ref(false);
const searchModal = ref(false);
const onInput = () => {
    // Handle input event if needed
};

const onSearch = async () => {
    if (!query.value.trim()) return;
    console.log('Searching for:', query.value);
    loading.value = true;

    try {
        const response = await axios.get(`http://localhost:3000/api/search`, {
            params: {
                q: query.value
            }
        });
        results.value = response.data;
        searchModal.value = true;
        console.log('Search results:', results.value);
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Optional: Add any additional styles here */
</style>
