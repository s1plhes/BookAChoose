<template>

  <Head>
    <title>{{ bookData.title }} | Book-A-Choose</title>
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" :content="bookData.title" />
    <meta property="og:description" :content="bookData.description" />
    <meta property="og:image" :content="bookData.image" />
    <meta property="og:url" :content="URL + '/book/' + bookData.id" />
    <meta name="author" :content="bookData.author" />
  </Head>
  <div class="px-6 max-w-6xl mx-auto">
    <div v-if="bookData && bookData.title" class="mb-6">
      <!-- Tools toolbar -->
      <Back />
      <div v-if="user" class="p-2 my-3 backdrop-blur-sm bg-slate-900/20 rounded w-fit">
        <div v-if='bookData.author === user.name || user.role === "admin"' class="space-x-4">
          <Btn variant="primary" :href="`/book/${bookData.id}/edit`"> Edit Book </Btn>
          <Btn variant="danger" @click="showModal = true"> Delete book </Btn>
          <Btn variant="success" :href="`/book/${bookData.id}/chapter/create`">
            Add Chapter
          </Btn>
        </div>
      </div>
      <!-- Tools toolbar -->
      <div class="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 clearfix mb-3 space-x-8">
        <div class="mx-auto bg-glass p-3 rounded h-fit">
          <!-- Book Title & Author -->
          <h1 class="text-3xl font-bold text-zinc-50">{{ bookData.title }}</h1>
          <p class="text-lg text-zinc-100">By
            <RouterLink class="text-yellow-500" :to="`/${bookData.author}`">
              {{ bookData.author }}
            </RouterLink>
          </p>
          <!-- Book Title & Author -->
          <!-- LIKE SYSTEM -->

          <div v-if="user" class="inline-flex items-center space-x-5 text-white">
            <LikeBtn :userId="user.id" :bookId chapterId="0" />
            <div class="space-x-1">
              <i class="fa fa-heart mx-2"></i> {{ likesCount }} Likes
            </div>
          </div>
          <!-- LIKE SYSTEM -->
          <!-- Book Cover -->
          <div class="flex justify-center items-center self-center">
            <img class="object-scale-down object-center w-2/4 rounded" :src="bookData.image" />
          </div>
          <!-- Book Cover -->
          <!-- Data -->
          <!-- Description -->
          <div id="description" class="text-slate-50">
            <p class="mt-2 p-3 text-zinc-100">Description:</p>
            <p class="mt-2 p-3 text-zinc-100 bg-glass">
              {{ bookData.description }}
            </p>
          </div>
          <!-- Description -->
          <!-- Data -->
          <div class="text-slate-200 p-2 text-xs">
            <p>Published date: {{ formatDate(bookData.created_at) }}</p>
            <p>Last edit: {{ formatDate(bookData.created_at) }}</p>
          </div>
          <!-- Data -->
        </div>
        <div class="bg-glass p-3 rounded h-fit sm:mt-6 md:mt-4 mt-4">
          <!-- Chapters List -->
          <div>
            <h2 class="text-2xl font-bold text-zinc-50">Chapters</h2>
            <div class="mt-4">
              <div v-if="chapters.length > 0">
                <ul class="space-y-1">
                  <RouterLink v-for="chapter in chapters" :key="chapter.chapter_id"
                    :to="`/book/${chapter.book_id}/chapter/${chapter.chapter_id}`" size="small" variant="text"
                    class="w-full text-left text-zinc-100">
                    <li class="p-2 my-2 backdrop-blur-sm bg-slate-800/60 rounded hover:bg-slate-500/50">
                      {{ chapter.part.title }}
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
    <p v-if="errorMessage" class="text-red-500 my-2">{{ errorMessage }}</p>
    <p class="text-red-500 my-2" v-if="deletePhrase !== 'DELETE'">
      Invalid delete phrase
    </p>
    <p v-if="successMessage" class="text-green-500 my-2">{{ successMessage }}</p>
    <div class="modal-actions">
      <Btn variant="danger" @click="deleteBook">Delete</Btn>
    </div>
  </Modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { user } from "../../mixins/authMixin";
import { Head } from "@unhead/vue/components";
import { formatDate } from "../../plugins/formatDate";
import Cookies from "js-cookie";

const admin = ref("admin")
const route = useRoute();
const router = useRouter(); //for delete
const deletePhrase = ref(""); //for delete
const errorMessage = ref(""); //for delete
const bookData = ref({});
const chapters = ref([]);
const id = route.params.bookId;
const showModal = ref(false);
const bookId = route.params.bookId;
const likesCount = ref(0);
const API_URL = import.meta.env.VITE_APP_API;

const fetchABook = async () => {
  console.log("Fetching book...");
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/book/${id}`);
    bookData.value = data;

    console.log("Book data:", data);
  } catch (error) {
    console.error("Error fetching book:", error);
  }
};

const fetchChapters = async () => {
  console.log("Fetching chapters...");
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/allchapters/${id}`);
    chapters.value = data;
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};

const deleteBook = async () => {
  const token = Cookies.get("accessToken");
  if (deletePhrase.value === "DELETE") {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/book/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Book deleted successfully");
      router.back();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Book not found");
        errorMessage.value = "Book not found";
      } else {
        console.error("Error deleting book:", error);
        errorMessage.value = "Error deleting book";
      }
    } finally {
      deletePhrase.value = "";
    }
  } else {
    errorMessage.value = 'Please type "delete" to confirm deletion';
    deletePhrase.value = "";
  }
};

const getLikes = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/count/likes/${bookId}/0`);

    // Extract 'likes' from the response data
    if (data && typeof data.likes === "number") {
      likesCount.value = data.likes;
      console.log("Likes count:", likesCount.value);
    } else {
      console.error("Unexpected response structure:", data);
    }
  } catch (error) {
    console.error("Error getting likes", error);
  }
};

onMounted(() => {
  fetchABook();
  getLikes();
  fetchChapters();
  console.log(user)
});
</script>

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
