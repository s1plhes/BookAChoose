<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import 'trix/dist/trix.css'
import 'trix/dist/trix.js'
import { checkAuth } from '@/plugins/checkAuth'
import { user } from '@/mixins/authMixin'
import Cookies from 'js-cookie'
import { Head } from '@unhead/vue/components'

const token = Cookies.get('accessToken')
const route = useRoute()
const router = useRouter()
const chapterContent = ref('')
const bookId = route.params.bookId
const chapterId = route.params.chapterId
const title = ref('')
const editor = ref('')
const update_at = ref('')
const user_id = ref('')

const fetchChapterData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/book/${bookId}/chapter/${chapterId}`
    )
    chapterContent.value = response.data.body
    title.value = response.data.title
    editor.value = response.data.chapter_editor
    update_at.value = response.data.updated_at

    // Manually set the value of trix-editor
    const trixEditorElement = document.getElementById('chapter-content')
    trixEditorElement.editor.loadHTML(response.data.body)
  } catch (error) {
    console.error(error)
  }
}

const saveChapter = async () => {
  user_id.value = user.value.userId
  try {
    await axios.put(
      `${import.meta.env.VITE_API}/chapter/${chapterId}`,
      {
        //send data
        title: title.value,
        body: chapterContent.value,
        bookId: route.params.bookId,
        chapter_editor: user_id.value
      },
      {
        //Auth
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    router.push(`/book/${bookId}/chapter/${chapterId}`)
  } catch (error) {
    console.error(error)
  }
}

const updateChapterContent = () => {
  chapterContent.value = document.getElementById('chapter-content').value
}

onMounted(() => {
  checkAuth(user)
  fetchChapterData()
})
</script>

<template>
  <Head>
    <title>Edit {{ title }} | {{ SITE_NAME }}</title>
  </Head>
  <div class="container max-w-8xl mx-auto p-3 min-h-fit h-full">
    <div class="text-white space-y-4">
      <h2 class="text-2xl text-center font-semibold">Edit a Chapter</h2>
      <p class="text-xl text-center">{{ title }}</p>
      <p class="text-center text-sm text-gray-400">Last Update: {{ update_at }}</p>
    </div>
    <form @submit.prevent="saveChapter" class="space-y-6 mt-3">
      <div class="form-group">
        <label for="chapter-title" class="block text-lg font-medium text-gray-100"
          >Chapter Title</label
        >
        <input
          type="text"
          id="chapter-title"
          v-model="title"
          required
          class="input"
          placeholder="Enter the chapter title"
        />
      </div>

      <div class="form-group">
        <label for="chapter-content" class="block text-lg font-medium text-gray-100"
          >Chapter Content</label
        >
        <div class="mt-1 bg-slate-100 rounded-md">
          <trix-editor
            class="bg-slate-950 text-slate-100 h-fit min-h-[300px] w-full"
            id="chapter-content"
            @trix-change="updateChapterContent"
          ></trix-editor>
        </div>
      </div>
      <div class="text-center">
        <Btn variant="primary">Submit</Btn>
      </div>
    </form>
  </div>
</template>
