<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { user } from '../../mixins/authMixin'
const route = useRoute();
const books = ref([])
import BookCard from '@/components/BookCard.vue';
const API_URL = import.meta.env.VITE_APP_API;
const fetchUserBooks = async () => {
    const username = route.params.username;

    try {
        const { data } = await axios.get(`${API_URL}/${username}/books`);
        books.value = data;
    } catch (error) {
        console.error(`Error fetching books for user ${username}`, error);
    }
};

onMounted(() => {
    fetchUserBooks()
})

</script>

<template>

    <div class="p-6 max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-100 mb-6">{{ route.params.username }}'s books</h1>

        <div v-if="books.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="book in books" :key="book.id" class="p-2">
                    <BookCard :book="book" :cover="book.image" />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-gray-600">No books available or failed to fetch data.</p>
        </div>
    </div>
</template>


<style scoped>
.book-cover {
    height: 100% auto;
    width: 300px;
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1/1.41;
}

.book {
    padding: 10px;
    background-color: #111;
    border-radius: 5px;
}
</style>