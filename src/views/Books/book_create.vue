<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { user } from '../../mixins/authMixin'
import { checkAuth } from '@/plugins/checkAuth'
import uploadService from '@/services/uploadService'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { Head } from '@unhead/vue/components'


import { BookService } from '@/services/bookService'
const bookService = new BookService()


const router = useRouter()
const message = ref('')
const selectedFile = ref(null)
const bookData = ref({
  title: '',
  author: user.value.name,
  description: '',
  tags: ''
})

const createBook = async (event) => {
  event.preventDefault()

  try {
    let bookImage = bookData.value.image; // Mantén la URL actual de la imagen

    if (selectedFile.value) {
      // Subir el nuevo archivo
      bookImage = await uploadService.uploadFile(selectedFile.value);
    }

    const data = await bookService.createBook(bookData.value, bookImage);
    message.value = `Book created successfully with ID: ${data.id}`;
    resetForm();
    router.push(`/book/${data.id}`);
  } catch (error) {
    console.error('Error creating book:', error);
    message.value = error.message;
  }
};

const resetForm = () => {
  bookData.value = {
    title: '',
    author: user.value.name,
    description: '',
    tags: ''
  };
  selectedFile.value = null;
};

function handleFileUpload(event) {
  selectedFile.value = event.target.files[0];
}

onMounted(() => {
  checkAuth(user);
});
</script>

<template>

  <Head>
    <title>Create book | {{ SITE_NAME }}</title>
  </Head>

  <section class="p-12 max-w-6xl mt-6 w-full mx-auto h-fit bg-glass">
    <Btn class="mb-4" variant="yellow" href="/books">Back</Btn>
    <form @submit="createBook" class="mt-4">
      <h1 class="text-xl font-bold text-slate-100 mb-6">Create a New Book</h1>
      <h2 class="text-slate-200">Welcome to the Book creation wizard</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 space-x-12">
        <!-- column 1-->
        <div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-white">Title</label>
            <input type="text" id="title" v-model="bookData.title" required placeholder="Enter the book title"
              class="input transition duration-200" />
          </div>
          <div class="mb-4">
            <label for="author" class="block text-sm font-medium text-white">Author</label>
            <input type="text" id="author" v-model="bookData.author" class="input cursor-not-allowed" readonly />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-white">Description</label>
            <textarea id="description" v-model="bookData.description" required placeholder="Enter the book description"
              class="input transition duration-200 resize-none h-32"></textarea>
          </div>
          <div class="mb-4">
            <label for="tags" class="block text-sm font-medium text-white">Tags</label>
            <input type="text" id="tags" v-model="bookData.tags" placeholder="Enter the tags" class="input" />
          </div>
        </div>

        <!-- column 2-->
        <div>
          <div class="mb-4">
            <label for="image" class="block text-sm font-medium text-white">Image URL</label>
            <input type="file" id="image" @change="handleFileUpload" class="input" />
          </div>
        </div>
      </div>
      <Btn class="w-1/4 flex justify-center" variant="yellow" type="submit">Create Book</Btn>
    </form>
    <ErrorMessage :message="message" type="error" :autoClose="false" :autoCloseDelay="5000" />
  </section>
</template>
