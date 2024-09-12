<template>
  <div class="p-6 max-w-3xl mx-auto bg-glass">
    <Btn class="text-black" variant="yellow" :href="`/books`">Back</Btn>
    <div v-if="user">
      <h1 class="text-2xl font-bold text-slate-100 mb-6">
        Create Chapter for {{ bookData.title }}
      </h1>
      <form @submit.prevent="createChapter" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3">
          <div class="col-span-2">
            <div class="form-group">
              <label for="chapter-title" class="block text-xl font-medium text-gray-100">Chapter Title</label>
              <input type="text" id="chapter-title" v-model="chapterTitle" required class="input"
                placeholder="Enter the chapter title" />
            </div>
            <div class="mt-2">
              <!-- Editor toolbar -->

              <div>
                <div id="editor-toolbar" class="inline-flex my-2">
                  <button type="button" @click="formatText('bold')" class="btn btn-sm mr-2 text-white">
                    <i class="fa-solid fa-bold"></i>
                  </button>
                  <button type="button" @click="formatText('italic')" class="btn btn-sm mr-2 text-white">
                    <i class="fa-solid fa-italic"></i>
                  </button>
                  <button type="button" @click="formatText('underline')" class="btn btn-sm mr-2 text-white">
                    <i class="fa-solid fa-underline"></i>
                  </button>
                </div>
                <!-- Editor -->
                <div contenteditable="true" id="editor" ref="editor"
                  class="input h-fit min-h-[40vh] font-sans text-white p-2 border border-yellow-500"
                  @input="updateText"></div>
              </div>

              <Btn>Submit</Btn>
            </div>
          </div>
        </div>
      </form>
      <p v-if="message" class="mt-4 text-sm text-green-600">{{ message }}</p>
    </div>

    <div v-else>
      <p class="text-center text-red-600">You must be logged in to create a chapter.</p>
    </div>

    <Head>
      <title>Create chapter for {{ bookData.title }} | {{ SITE_NAME }}</title>
    </Head>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user } from '../../mixins/authMixin'
import axios from 'axios'
import { Head } from '@unhead/vue/components'
import { checkAuth } from '@/plugins/checkAuth'
import Cookies from 'js-cookie'

const userId = user.value.userId
const route = useRoute()
const router = useRouter()
const chapterTitle = ref('')
const chapterContent = ref('')
const message = ref('')
const bookId = route.params.bookId
const bookData = ref({})

const fetchBookData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/book/${bookId}`)
    bookData.value = response.data
  } catch (error) {
    console.error(error)
    message.value = `Error: ${error.response?.data?.error || error.message}`
  }
}

const createChapter = async (event) => {
  event.preventDefault()
  const token = Cookies.get('accessToken')
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/chapter/create`,
      {
        book_id: bookId,
        title: chapterTitle.value,
        body: chapterContent.value,
        chapter_editor: userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    message.value = `Chapter created successfully with ID: ${response.data.id}`
    router.push(`/book/${bookId}/chapter/${response.data.id}`)
    chapterTitle.value = ''
    chapterContent.value = ''
  } catch (error) {
    message.value = `Error: ${error.response?.data?.error || error.message}`
  }
}

const updateText = () => {
  const editor = document.getElementById('editor')
  chapterContent.value = editor.innerHTML
}

const formatText = (command) => {
  document.execCommand(command, false, null)
}
onMounted(() => {
  checkAuth(user)
  fetchBookData()
})
</script>

<style scoped>
/* Add Tailwind CSS styles here */
</style>
