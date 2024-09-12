<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { user } from '../../mixins/authMixin'
import SepaRator from '@/components/SepaRator.vue'
import { checkAuth } from '@/plugins/checkAuth'
import Cookies from 'js-cookie'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { Head } from '@unhead/vue/components'

const router = useRouter()
const title = ref('')
const description = ref('')
const image = ref('')
const message = ref('')
const author = user.value.name
const selectedFile = ref(null) // Variable reactiva para el archivo seleccionado

const createBook = async (event) => {
  event.preventDefault()
  const token = Cookies.get('accessToken')

  if (!token) {
    message.value = 'Authorization token is missing. Please log in again.'
    return
  }
  let bookImage = image.value // Mantén la URL actual del avatar

  if (selectedFile.value) {
    // Subir el nuevo avatar
    const uploadResult = await uploadFile(selectedFile.value)
    if (uploadResult) {
      bookImage = uploadResult // Actualiza la URL del avatar
    } else {
      throw new Error('Book upload failed')
    }
  }
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API}/book/create`,
      {
        title: title.value,
        author: author,
        description: description.value,
        image: bookImage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    message.value = `Book created successfully with ID: ${data.id}`
    resetForm()
    router.push(`/book/${data.id}`)
  } catch (error) {
    console.error('Error creating book:', error) // Log the error for debugging
    message.value = error.response?.data?.error || 'Error creating book'
  }
}
const resetForm = () => {
  title.value = ''
  description.value = ''
  image.value = ''
}
async function uploadFile(file) {
  if (!file) {
    message.value = 'Please select a file first'
    return null
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${import.meta.env.VITE_API}/upload`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      return result.url
    } else {
      message.value = 'File upload failed: ' + result.message
      return null
    }
  } catch (error) {
    message.value = 'An error occurred: ' + error.message
    return null
  }
}

// Maneja el archivo cargado
function handleFileUpload(event) {
  selectedFile.value = event.target.files[0]
}

onMounted(() => {
  //Check if there's an authenticated user
  checkAuth(user)
})
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
      <SepaRator />
      <div class="grid grid-cols-1 lg:grid-cols-2 space-x-12">
        <!-- column 1-->
        <div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-white">Title</label>
            <input
              type="text"
              id="title"
              v-model="title"
              required
              placeholder="Enter the book title"
              class="input transition duration-200"
            />
          </div>
          <div class="mb-4">
            <label for="author" class="block text-sm font-medium text-white">Author</label>
            <input
              type="text"
              id="author"
              v-model="author"
              placeholder="Enter the book author"
              class="input cursor-not-allowed"
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-white"
              >Description</label
            >
            <textarea
              id="description"
              v-model="description"
              required
              placeholder="Enter the book description"
              class="input transit ion duration-200 resize-none h-32"
            ></textarea>
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
    <SepaRator />
  </section>
</template>

<style scoped>
/* Optional: Additional styles if needed */
</style>
