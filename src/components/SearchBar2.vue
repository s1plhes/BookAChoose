<template>
    <div class="relative">
        <input v-model="query" @input="onInput" type="text"
            class="px-4 py-2 w-full border border-slate-700 bg-slate-950 rounded-lg text-white focus:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search..." aria-label="Search input" />
        <button @click="onSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-slate-950 text-white rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Search button">
            Search
        </button>
        <div v-if="loading" class="text-white mt-2">Loading...</div>
        <Modal :showModal="searchModal" title="Search Results" @update:showModal="searchModal = $event">
            <div v-if="results.length">
                <ul class="space-y-4">
                    <li v-for="item in results" :key="item.id" class="gap-x-2 gap-6">
                        <Btn v-if="item.book_id" variant="primary" :href="`/book/${item.book_id}`">
                            {{ item.book_title }}
                        </Btn>
                        <Btn v-if="item.user_name" variant="primary" :href="`/${item.user_name}`">
                            {{ item.user_name }}
                        </Btn>
                    </li>
                </ul>
            </div>
            <p v-else class="text-white">No results found.</p>
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
