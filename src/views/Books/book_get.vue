<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { user } from '../../mixins/authMixin'
import { Head } from '@unhead/vue/components'
import { formatDate } from '../../plugins/formatDate'
import { BookService } from '@/services/bookService'
import { toast } from 'vue3-toastify'

const bookService = new BookService()
const route = useRoute()
const router = useRouter()
const bookData = ref([])
const chapters = ref([])
const showModal = ref(false)
const bookId = route.params.bookId
const likesCount = ref(0)

const deletePhrase = ref('')


const deleteBook = async () => {
  if (deletePhrase.value !== 'DELETE') {
    return toast.error('Invalid delete phrase', {
      autoClose: 3000,
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark'
    });
  }

  try {
    await bookService.deleteBook(bookId); // Llamas al servicio y pasas el token
    toast.success('Book deleted successfully', {
      autoClose: 3000,
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark'
    });
    router.push('/books'); // Rediriges después de eliminar
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error('Book not found', {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      });
    } else {
      toast.error(`Error deleting book: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      });
    }
  } finally {
    deletePhrase.value = ''; // Reseteas el campo después de la operación
  }
};

const bookTags = ref({})

onMounted(async () => {
  likesCount.value = await bookService.getBookLikes(bookId)
  bookData.value = await bookService.getBookById(bookId)
  chapters.value = await bookData.value.chapters
})
</script>

<template>

  <Head>
    <title>{{ bookData.title }} | Book-A-Choose</title>
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" :content="bookData.title" />
    <meta property="og:description" :content="bookData.description" />
    <meta property="og:image" :content="bookData.image" />
    <meta name="author" :content="bookData.author" />
  </Head>
  <div class="px-2 max-w-6xl mx-auto">
    <div v-if="bookData && bookData.title" class="mb-6">
      <div class="flex items-center gap-4">
        <Btn class="" variant="yellow" href="/books">Back</Btn>
        <div v-if="user" class=" my-3 rounded w-fit">
          <div v-if="bookData.author === user.name || user.role === 'admin'" class="space-x-4">
            <RouterLink v-tooltip="'Edit book'" :to="`/book/${bookData.id}/edit`"><i
                class="fa-solid fa-pen-nib text-xl text-slate-100 hover:text-salte-200 hover:scale-110" />
            </RouterLink>
            <button v-tooltip="'Delete book'" @click="showModal = true"><i
                class="fa-solid fa-recycle text-xl text-slate-100 hover:text-salte-200 hover:scale-110" />
            </button>
            <RouterLink v-tooltip="'Add chapter'" :to="`/book/${bookData.id}/chapter/create`"><i
                class="fa-solid fa-file-circle-plus text-xl text-slate-100 hover:text-salte-200 hover:scale-110" />
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 clearfix mb-3 gap-6">
        <div class="mx-auto bg-glass p-3 rounded h-fit">
          <h1 class="text-3xl font-bold text-zinc-50">{{ bookData.title }}</h1>
          <p class="text-lg text-zinc-100 gap-4 space-x-2">
            By
            <RouterLink class="text-yellow-500" :to="`/${bookData.author}`">
              {{ bookData.author }}
            </RouterLink>
          <div v-if="user" class="inline-flex items-center space-x-2 text-white">
            <LikeBtn :userId="user.id" :bookId chapterId="0" />
            <span>{{ bookData.likes }} Likes</span>
          </div>
          </p>
          <div class="flex justify-center items-center self-center">
            <img class="object-scale-down object-center w-2/4 rounded" :src="bookData.image" />
          </div>
          <div id="description" class="text-slate-50">
            <p class="mt-2 p-3 text-zinc-100">
              {{ bookData.description }}
            </p>
          </div>
          <div class="text-slate-200 p-2 text-xs">
            <p>Published date: {{ formatDate(bookData.created_at) }}</p>
            <p>Last edit: {{ formatDate(bookData.created_at) }}</p>
            <div id="tags" class="my-3" v-if="bookData?.tags">
              <RouterLink v-for="tag in bookData?.tags.split(',').map(tag => tag.trim())" :key="tag"
                :to="`/books/${tag}`" class="bg-yellow-500 text-black p-2 rounded-lg m-3 mx-1 uppercase font-semibold">
                {{ tag }}
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="bg-glass p-4 rounded h-fit sm:mt-6 md:mt-4 mt-4">
          <div>
            <h2 class="text-2xl font-bold text-zinc-50">Chapters</h2>
            <div class="mt-4">
              <div v-if="bookData">
                <ul class="space-y-1">
                  <RouterLink v-for="chapter in chapters" :key="chapter.chapter_id"
                    :to="`/book/${chapter.book_id}/chapter/${chapter.chapter_id}`" size="small" variant="text"
                    class="w-full text-left text-zinc-100">
                    <li class="p-2 my-2 bg-glass hover:bg-slate-500/50">
                      Chapter {{ chapter.chapter_id }}: {{ chapter.part.title }}
                    </li>
                  </RouterLink>
                </ul>
              </div>
              <div v-else>
                <h1 class="text-gray-100">There are no chapters available yet.</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-100">No book data available or failed to load.</p>
    </div>
  </div>
  <Modal :showModal="showModal" title="Delete Book" @update:showModal="showModal = $event">
    <p class="text-white my-2">Are you sure you want to delete this book?</p>
    <input class="input" v-model="deletePhrase" type="text" :placeholder="`Enter 'DELETE' to delete`" />
    <p class="text-red-500 my-2" v-if="deletePhrase !== 'DELETE'">Invalid delete phrase</p>
    <div class="modal-actions">
      <Btn variant="danger" @click="deleteBook">Delete</Btn>
    </div>
  </Modal>
</template>

<style scoped>
.book-cover {
  height: auto;
  width: 100%;
  max-width: 300px;
  object-fit: cover;
  border: 1px solid #fefffa;
  border-radius: 5px;
}
</style>
