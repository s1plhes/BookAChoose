<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '../../mixins/authMixin'
import { Head } from '@unhead/vue/components'
import axios from 'axios'
import Cookies from 'js-cookie'

const route = useRoute()
const bookData = ref(null)
const chapterData = ref(null)
const id = route.params.chapterId
const fontSize = ref(Cookies.get('fontSize') || 18)
const viewRecorded = ref(false)
const bookId = route.params.bookId
const chapterId = route.params.chapterId
const likesCount = ref(0)

const fetchABook = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/book/${bookId}/chapter/${chapterId}`
    )
    bookData.value = data
    chapterData.value = formatTextLikeBook(data.body)
  } catch {
    console.error('Error fetching book')
  }
}

function formatTextLikeBook(text) {
  const paragraphs = text.trim().split(/\n\s*\n/)
  return paragraphs
    .map((para, index) => {
      return `<div id="para-${index + 1}">${para.trim()}</div>`
    })
    .join('')
}

const increaseFontSize = () => {
  fontSize.value += 2
}

const decreaseFontSize = () => {
  fontSize.value -= 2
}

const recordView = async () => {
  if (!viewRecorded.value) {
    try {
      await axios.post(`${import.meta.env.VITE_API}/chapter/${id}/view`)
      viewRecorded.value = true
      console.log('View recorded')
    } catch {
      console.error('Error recording view')
    }
  }
}
const getLikes = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/count/likes/${bookId}/${chapterId}`
    )

    // Extract 'likes' from the response data
    if (data && typeof data.likes === 'number') {
      likesCount.value = data.likes
      console.log('Likes count:', likesCount.value)
    } else {
      console.error('Unexpected response structure:', data)
    }
  } catch (error) {
    console.error('Error getting likes', error)
  }
}

let viewTimeout

let nextChapter = parseInt(route.params.chapterId) + parseInt(1)
onMounted(() => {
  fetchABook()
  getLikes()

  viewTimeout = setTimeout(() => {
    recordView()
  }, 59000)
})

const whatsappShare = () => {
  const whatsappMsg = `Check out this chapter ${bookData.value.title} on Book-A-Choose: ${import.meta.env.VITE_APP_URL}book/${bookId}/chapter/${chapterId}`
  const encoded = encodeURIComponent(whatsappMsg)
  const sendURL = `https://wa.me/?text=${encoded}`

  window.open(sendURL, '_blank')
}

//Mount all
onUnmounted(() => {
  clearTimeout(viewTimeout)
})
</script>

<template>
  <Head v-if="bookData">
    <title>{{ bookData.title }} | Book-A-Choose</title>
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" :content="bookData.title" />
    <meta property="og:description" :content="bookData.description" />
    <meta property="og:image" :content="bookData.image" />
    <meta property="og:url" :content="URL + '/book/' + bookData.id" />
    <meta name="author" :content="bookData.author" />
  </Head>

  <div class="max-w-6xl mx-auto p-4 mb-6 bg-glass rounded-lg text-white">
    <Btn class="text-black" variant="yellow" :href="`/book/${bookId}`">Back</Btn>
    <div class="space-y-3 mb-6">
      <!-- Tools toolbar -->
      <div
        v-if="user && bookData"
        class="p-2 inline-flex items-center backdrop-blur-sm bg-slate-950 rounded space-x-5"
      >
        <div v-if="bookData.author === user.id" class="space-x-4">
          <RouterLink
            v-tooltip="'Edit chapter'"
            :to="`/book/${bookData.book_id}/chapter/${id}/edit`"
            ><i class="fa-solid fa-pen-nib text-xl"></i>
          </RouterLink>
        </div>
        <!-- LIKE SYSTEM -->
        <div v-if="user" class="inline-flex items-center space-x-4">
          <LikeBtn :userId="user.id" :bookId :chapterId class="mr-2" />
          {{ likesCount }} likes
        </div>
        <div><ViewIcon v-tooltip="'Views'" /> {{ bookData.views }}</div>
        <div>
          <span v-tooltip="'Font Size'"><i class="fa-solid fa-text-height"></i></span>
          <button
            v-tooltip="'Decrease Font Size'"
            type="button"
            @click="decreaseFontSize"
            class="bg-transparent px-2 py-1 rounded"
          >
            <i class="fa-solid fa-circle-minus"></i>
          </button>
          <span v-tooltip="'Font Size'">{{ fontSize }}px</span>
          <button
            v-tooltip="'Increase Font Size'"
            type="button"
            @click="increaseFontSize"
            class="bg-transparent px-2 py-1 rounded"
          >
            <i class="fa-solid fa-circle-plus"></i>
          </button>
        </div>

        <!-- LIKE SYSTEM -->
      </div>

      <!-- Tools toolbar -->
    </div>
    <div v-if="bookData">
      <h2 class="text-4xl font-semibold mb-4">{{ bookData.title }}</h2>

      <div
        @click="whatsappShare"
        v-tooltip="'Share on whatsapp'"
        class="inline-flex mt-8 cursor-pointer text-2xl"
      >
        <i class="fab fa-whatsapp mr-3" />
      </div>

      <a class="text-xl" :href="`/book/${bookId}/chapter/${nextChapter}`">Next chapter</a>
    </div>

    <hr class="border-gray-700/20 my-4" />

    <div
      v-if="chapterData"
      v-html="chapterData"
      :style="{ fontSize: fontSize + 'px' }"
      class="text-zinc-300 leading-relaxed first-line:uppercase first-line:tracking-widest text-justify"
    ></div>

    <div class="py-6 flex justify-center">
      <a class="text-xl" :href="`/book/${bookId}/chapter/${nextChapter}`">Next chapter</a>
      <div class="text-2xl ml-6 text-white"></div>
    </div>
    <CommentBox :bookId="bookId" :chapterId="chapterId" />
  </div>
</template>
