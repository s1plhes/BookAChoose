<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { user } from '../../mixins/authMixin';
import axios from 'axios';
import 'trix/dist/trix.css';
import 'trix/dist/trix.js';
import Separator from '@/components/Separator.vue';
import { Head } from '@unhead/vue/components';
import { checkAuth } from '@/plugins/checkAuth';
import Cookies from 'js-cookie';


const route = useRoute();
const router = useRouter();
const chapterTitle = ref('');
const chapterContent = ref('');
const message = ref('');
const bookId = route.params.bookId;
const bookData = ref({});
const API_URL = import.meta.env.VITE_APP_API;

const updateChapterContent = (event) => {
    chapterContent.value = event.target.innerHTML; // Captura el contenido HTML de Trix
};

const fetchBookData = async () => {
    try {
        const response = await axios.get(`${process.env.API}/book/${bookId}`);
        bookData.value = response.data;
    } catch (error) {
        console.error(error);
        message.value = `Error: ${error.response?.data?.error || error.message}`;
    }
};

const createChapter = async (event) => {
    event.preventDefault();
    const token = Cookies.get('accessToken');
    try {
        const response = await axios.post(`${process.env.API}/chapter/create`, {
            book_id: bookId,
            title: chapterTitle.value,
            body: chapterContent.value
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        message.value = `Chapter created successfully with ID: ${response.data.id}`;
        router.push(`/book/${bookId}/chapter/${response.data.id}`);
        chapterTitle.value = '';
        chapterContent.value = '';
    } catch (error) {
        message.value = `Error: ${error.response?.data?.error || error.message}`;
    }
};

onMounted(() => {
    checkAuth(user)
    fetchBookData()
});
</script>

<template>


    <div class="p-6 max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-sm">
        <!-- Back Button and Divider -->
        <a class="px-4 py-1 bg-zinc-100 text-sm text-zinc-800 font-semibold rounded hover:text-black hover:bg-zinc-300 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            href="/books">Back</a>
        <Separator />

        <div v-if="user">
            <h1 class="text-2xl font-bold text-slate-100 mb-6">Create Chapter for {{ bookData.title }}</h1>

            <form @submit.prevent="createChapter" class="space-y-6">
                <!-- Chapter Title -->
                <div class="form-group">
                    <label for="chapter-title" class="block text-xl font-medium text-gray-100">Chapter Title</label>
                    <input type="text" id="chapter-title" v-model="chapterTitle" required class="input"
                        placeholder="Enter the chapter title">
                </div>

                <!-- Chapter Content -->
                <div class="form-group">
                    <label for="chapter-content" class="block text-xl font-medium text-gray-100">Chapter Content</label>
                    <div class="mt-1 p-1 bg-slate-50 text-slate-950  ">
                        <trix-editor id="chapter-content" @trix-change="updateChapterContent"
                            input="chapterContentInput"></trix-editor>
                        <input id="chapterContentInput" type="hidden" v-model="chapterContent">
                        <!-- Hidden input to bind content -->
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <Btn variant="primary">Submit</Btn>
                </div>
            </form>

            <p v-if="message" class="mt-4 text-sm text-green-600">{{ message }}</p>
        </div>

        <div v-else>
            <p class="text-center text-red-600">You must be logged in to create a chapter.</p>
        </div>

        <Head>
            <title>
                Create chapter for {{ title }} | {{ SITE_NAME }}
            </title>
        </Head>
    </div>
</template>

<style scoped></style>
