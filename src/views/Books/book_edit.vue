<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { user } from '@/mixins/authMixin';
import Cookies from 'js-cookie';

const title = ref('')
const author = ref('')
const description = ref('')
const image = ref('')
const message = ref('')

const router = useRouter()
const route = useRoute()

const loadBook = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/book/${route.params.bookId}`)
        title.value = response.data.title
        author.value = response.data.author
        description.value = response.data.description
        image.value = response.data.image
    } catch (error) {
        message.value = 'Error loading book'
    }
}


const updateBook = async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
        message.value = 'Authorization token is missing.';
        return;
    }

    try {
        const response = await axios.put(
            `http://localhost:3000/api/book/update/${route.params.bookId}`,
            {
                title: title.value,
                author: author.value,
                description: description.value,
                image: image.value
            },
            {
                headers: {
                    Authorization: `${token}`  // Include the token in the Authorization header
                }
            }
        );

        if (response.status === 200) {
            message.value = 'Book updated successfully';
            router.push(`/book/${route.params.bookId}`);  // Fixed typo here
        }
    } catch (error) {
        console.error('Error updating book:', error);  // Log the error for debugging
        message.value = 'Error updating book: ' + (error.response?.data?.message || error.message);
    }
};
const checkAuth = async () => {
    if (!user.value) {
        router.push('/403')
    }
}

onMounted(() => {
    checkAuth()
    loadBook()

})
</script>

<template>
    <main class="p-6 min-w-lg mx-auto bg-slate-900/30 text-white min-h-fit">
        <div v-if="title">
            <h1 class="text-2xl font-bold mb-6 text-center">Edit {{ title }}</h1>
            <Separator />
            <form @submit.prevent="updateBook" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="mb-4">
                            <label for="title" class="block text-xs font-medium">Title</label>
                            <input type="text" id="title" v-model="title" required class="input" />
                        </div>

                        <div class="mb-4">
                            <label for="author" class="block text-xs font-medium">Author</label>
                            <input type="text" id="author" v-model="author" required class="input" />
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block text-xs font-medium">Description</label>
                            <textarea id="description" v-model="description" required rows="auto"
                                class="peer input resize-none h-fit min-h-[30vh]"></textarea>
                        </div>

                        <div class="mb-4">
                            <label for="image" class="block text-xs font-medium">Image URL</label>
                            <input type="text" id="image" v-model="image" required class="input" />
                        </div>
                    </div>
                    <div>
                        <img :src="image" alt="Book Image" v-if="image"
                            class="h-full max-h-80 aspect-auto mt-4 rounded-xs border border-gray-600 p-4" />
                    </div>
                </div>
                <Btn variant="fullyellow" class="w-1/4 text-black">Update Book</Btn>
            </form>
        </div>
        <ErrorMessage :message="message" type="error" :autoClose="false" :autoCloseDelay="5000" />
        <Separator />
        <p>
            <Btn variant="danger" href="/books">Back</Btn>
        </p>
    </main>
</template>
