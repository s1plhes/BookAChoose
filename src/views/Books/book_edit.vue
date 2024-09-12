<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { user } from '@/mixins/authMixin'
import Cookies from 'js-cookie'
import { Head } from '@unhead/vue/components'
import { toast } from 'vue3-toastify'

const title = ref('')
const author = ref('')
const description = ref('')
const image = ref(null)
const imageURL = ref('') // Variable para URL de imagen
const message = ref('')
const router = useRouter()
const route = useRoute()
const tags = ref('')
const selectedFile = ref(null)
const coverUrl = ref(null)
const toggleURL = ref(false) // Para mostrar/ocultar campos
const bookLoaded = ref(false)
const bookId = route.params.bookId

toast
const loadBook = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/book/${route.params.bookId}`)
    title.value = response.data.title
    author.value = response.data.author
    description.value = response.data.description
    image.value = response.data.image
    tags.value = response.data.tags
    imageURL.value = response.data.image
    bookLoaded.value = true
  } catch (error) {
    toast.error(`Error loading book,try later`, {
      autoClose: false
    })
  }
}

const updateBook = async () => {
  const token = Cookies.get('accessToken')
  if (!token) {
    message.value = 'Authorization token is missing.'
    return
  }
  let bookImage = toggleURL.value ? imageURL.value : image.value // Usa URL de la imagen o archivo

  if (!toggleURL.value && selectedFile.value) {
    // Subir el nuevo archivo si no se usa URL
    const uploadResult = await uploadFile(selectedFile.value)
    if (uploadResult) {
      bookImage = uploadResult // Actualiza la URL del archivo
    } else {
      throw new Error('File upload failed')
    }
  }

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API}/book/update/${route.params.bookId}`,
      {
        title: title.value,
        author: author.value,
        description: description.value,
        tags: tags.value,
        image: bookImage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200) {
      message.value = 'Book updated successfully'
      router.push(`/book/${route.params.bookId}`)
    }
  } catch (error) {
    toast.error(`Error loading book,try later${error.response?.data?.message || error.message}`, {
      autoClose: false
    })
  }
}

const checkAuth = async () => {
  if (!user.value) {
    router.push('/403')
  }
}

async function uploadFile(file) {
  if (!file) {
    toast.error(`Please select a file first`, {
      autoClose: false
    })
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

function toggleCoverURL() {
  toggleURL.value = !toggleURL.value
  if (toggleURL.value) {
    coverUrl.value = imageURL.value // Muestra la imagen URL si se usa URL
  } else {
    coverUrl.value = null // Limpia la vista previa si no se usa URL
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      image.value = e.target.result // Muestra una vista previa de la imagen
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  checkAuth()
  loadBook()
})
</script>
<template>
  <Head>
    <title>Edit {{ title }} | {{ SITE_NAME }}</title>
  </Head>
  <main class="px-8 py-6 max-w-6xl mx-auto bg-glass text-white min-h-fit">
    <Btn class="text-black" variant="yellow" :href="`/book/${bookId}`">Back</Btn>
    <div v-if="bookLoaded === true">
      <h1 class="text-4xl font-bold mb-6 text-center">Edit {{ title }}</h1>
      <SepaRator />
      <form @submit.prevent="updateBook" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="mb-4">
              <label for="title" class="block text-2xl font-medium">Title</label>
              <input type="text" id="title" v-model="title" required class="input" />
            </div>

            <div class="mb-4">
              <label for="author" class="block text-2xlfont-medium">Author</label>
              <input type="text" id="author" v-model="author" required class="input" />
            </div>

            <div class="mb-4">
              <label for="description" class="block text-2xl font-medium">Description</label>
              <textarea
                id="description"
                v-model="description"
                required
                rows="auto"
                class="peer input resize-none h-fit min-h-[30vh]"
              ></textarea>
            </div>
            <div class="mb-4">
              <label for="tags" class="block text-2xl font-medium"
                >Tags
                <span class="text-sm">Write your book's tag separeting it with commas ,</span>
                <input id="tags" v-model="tags" required rows="auto" class="peer input" />
              </label>
            </div>
            <div class="mb-4">
              <label for="image" class="block text-2xl font-medium">Cover</label>
              <!-- toggle image upload -->
              <div
                class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
              >
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  @click="toggleCoverURL"
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  for="toggle"
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-yellow-500 cursor-pointer"
                ></label>
              </div>
              <label for="toggle" class="text-xs text-white"
                >Toggle to switch between upload and enter URL.</label
              >

              <!-- toggle image upload -->
              <input
                type="file"
                id="image"
                @change="handleFileUpload"
                v-show="!toggleURL"
                class="input"
              />
              <input
                type="text"
                id="imageURL"
                v-model="imageURL"
                v-show="toggleURL"
                class="input"
              />
            </div>
          </div>
          <div>
            <img
              :src="image"
              alt="Book Image"
              v-if="image"
              class="h-[25veh] aspect-auto mt-4 rounded-xs border border-gray-600 p-4"
            />
          </div>
        </div>
        <Btn variant="yellow" class="w-1/4 text-black justify-center">Update Book</Btn>
      </form>
    </div>
    <ErrorMessage :message="message" type="error" :autoClose="false" :autoCloseDelay="5000" />
    <SepaRator />
  </main>
</template>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68d391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68d391;
}
</style>
