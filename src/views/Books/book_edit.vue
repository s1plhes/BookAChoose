<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { user } from '@/mixins/authMixin';
import Cookies from 'js-cookie';
import { Head } from '@unhead/vue/components';

const title = ref('')
const author = ref('')
const description = ref('')
const image = ref(null)
const imageURL = ref('') // Variable para URL de imagen
const message = ref('')
const router = useRouter()
const route = useRoute()
const selectedFile = ref(null)
const coverUrl = ref(null)
const toggleURL = ref(false) // Para mostrar/ocultar campos

const loadBook = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/book/${route.params.bookId}`)
        title.value = response.data.title
        author.value = response.data.author
        description.value = response.data.description
        image.value = response.data.image
        imageURL.value = response.data.image
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
    let bookImage = toggleURL.value ? imageURL.value : image.value; // Usa URL de la imagen o archivo

    if (!toggleURL.value && selectedFile.value) {
        // Subir el nuevo archivo si no se usa URL
        const uploadResult = await uploadFile(selectedFile.value);
        if (uploadResult) {
            bookImage = uploadResult; // Actualiza la URL del archivo
        } else {
            throw new Error('File upload failed');
        }
    }

    try {
        const response = await axios.put(
            `http://localhost:3000/api/book/update/${route.params.bookId}`,
            {
                title: title.value,
                author: author.value,
                description: description.value,
                image: bookImage,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            message.value = 'Book updated successfully';
            router.push(`/book/${route.params.bookId}`);
        }
    } catch (error) {
        console.error('Error updating book:', error);
        message.value = 'Error updating book: ' + (error.response?.data?.message || error.message);
    }
}

const checkAuth = async () => {
    if (!user.value) {
        router.push('/403')
    }
}

async function uploadFile(file) {
    if (!file) {
        message.value = 'Please select a file first';
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            return result.url;
        } else {
            message.value = 'File upload failed: ' + result.message;
            return null;
        }
    } catch (error) {
        message.value = 'An error occurred: ' + error.message;
        return null;
    }
}

function toggleCoverURL() {
    toggleURL.value = !toggleURL.value;
    if (toggleURL.value) {
        coverUrl.value = imageURL.value; // Muestra la imagen URL si se usa URL
    } else {
        coverUrl.value = null; // Limpia la vista previa si no se usa URL
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            image.value = e.target.result;  // Muestra una vista previa de la imagen
        };
        reader.readAsDataURL(file);
    }
}

onMounted(() => {
    checkAuth()
    loadBook()
})
</script>
<template>

    <Head>
        <title>
            Edit {{ title }} | {{ SITE_NAME }}
        </title>
    </Head>
    <main class="p-6 max-w-6xl min-w-lg mx-auto bg-slate-900/30 text-white min-h-fit">
        <div v-if="title">
            <h1 class="text-2xl font-bold mb-6 text-center">Edit {{ title }}</h1>
            <Separator />
            <form @submit.prevent="updateBook" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="mb-4">
                            <label for="title" class="block text-lg font-medium">Title</label>
                            <input type="text" id="title" v-model="title" required class="input" />
                        </div>

                        <div class="mb-4">
                            <label for="author" class="block text-lg font-medium">Author</label>
                            <input type="text" id="author" v-model="author" required class="input" />
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block text-lg font-medium">Description</label>
                            <textarea id="description" v-model="description" required rows="auto"
                                class="peer input resize-none h-fit min-h-[30vh]"></textarea>
                        </div>

                        <div class="mb-4">
                            <label for="image" class="block text-lg font-medium">Cover</label>
                            <!-- toggle image upload -->
                            <div
                                class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" @click="toggleCoverURL"
                                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label for="toggle"
                                    class="toggle-label block overflow-hidden h-6 rounded-full bg-yellow-500 cursor-pointer"></label>
                            </div>
                            <label for="toggle" class="text-xs text-white">Toggle to switch between upload and enter
                                URL.</label>

                            <!-- toggle image upload -->
                            <input type="file" id="image" @change="handleFileUpload" v-show="!toggleURL"
                                class="input" />
                            <input type="text" id="imageURL" v-model="imageURL" v-show="toggleURL" class="input" />
                        </div>
                    </div>
                    <div>
                        <img :src="image" alt="Book Image" v-if="image"
                            class=" h-[25veh] aspect-auto mt-4 rounded-xs border border-gray-600 p-4" />
                    </div>
                </div>
                <Btn variant="yellow" class="w-1/4 text-black justify-center">Update Book</Btn>
            </form>
        </div>
        <ErrorMessage :message="message" type="error" :autoClose="false" :autoCloseDelay="5000" />
        <Separator />
        <p>
            <Btn variant="danger w-1/4" href="/books">Back</Btn>
        </p>
    </main>
</template>

<style scoped>
.toggle-checkbox:checked {
    right: 0;
    border-color: #68D391;
}

.toggle-checkbox:checked+.toggle-label {
    background-color: #68D391;
}
</style>
