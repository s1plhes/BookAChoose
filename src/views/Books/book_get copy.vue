<template>
  <div class="px-6 max-w-6xl mx-auto">
    <!-- Back Button and Divider -->
    <div class="mt-6">

      <Separator />
    </div>
    <div v-if="bookData && bookData.title">
      <h1 class="text-3xl font-bold text-zinc-50">{{ bookData.title }}</h1>
      <p class="text-lg text-zinc-100">by {{ bookData.author }}</p>
      <!-- Tools toolbar -->
      <div v-if="user" class="p-2 my-3 backdrop-blur-sm bg-slate-900/20 rounded w-fit">
        <div v-if="bookData.author === user.name" class="space-x-4">
          <span>Tools:</span>
          <Btn variant="primary" :href="`/book/${bookData.id}/edit`"> Edit Book </Btn>
          <Btn variant="danger" @click="showModal = true"> Delete book </Btn>
          <Btn variant="success" :href="`/book/${bookData.id}/chapter/create`">
            Add Chapter
          </Btn>
        </div>
      </div>
      <!-- Tools toolbar -->
      <div class="grid grid-cols-2 clearfix mb-3 space-x-8">
        <div class="mx-auto backdrop-blur-sm bg-slate-900/30 p-3 rounded h-fit">
          <div class="flex justify-center items-center self-center"> <img
              class="object-scale-down object-center w-2/4 rounded" :src="bookData.image">
          </div>
          <div class="text-slate-50">
            <p>Written by {{ bookData.author }}</p>
            <p>Published date: {{ formatDate(bookData.created_at) }}</p>
            <p>Last edit: {{ formatDate(bookData.created_at) }}</p>
          </div>

        </div>
        <div class="backdrop-blur-sm bg-slate-900/20 p-3 rounded h-fit">
          <!-- Chapters List -->
          <p class="mt-2 p-3 text-zinc-100">Description:</p>
          <p class="mt-2 p-3 text-zinc-100 bg-slate-800/40 backdrop-blur-sm">{{ bookData.description }}</p>

          <div>
            <h2 class="text-2xl font-bold text-zinc-50">Chapters</h2>
            <div class="mt-4">
              <div v-if="chapters.length > 0">
                <ul class="space-y-1">
                  <a v-for="chapter in chapters" :key="chapter.id" :href="`/book/${bookData.id}/chapter/${chapter.id}`"
                    size="small" variant="text" class="w-full text-left text-zinc-100">
                    <li class="p-2 my-2 
                      backdrop-blur-sm bg-slate-900/60 rounded
                      hover:bg-slate-500/50">
                      {{ chapter.title }}
                    </li>
                  </a>
                </ul>
              </div>
              <div v-else>
                <h1 class="text-gray-100">No chapters available or failed to load.</h1>
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
    <input v-model="deletePhrase" type="text" placeholder="Enter delete phrase" />
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
import { RouterLink } from "vue-router";

const route = useRoute();
const router = useRouter(); //for delete
const deletePhrase = ref(""); //for delete
const errorMessage = ref(""); //for delete
const bookData = ref({});
const chapters = ref([]);
const id = route.params.id;
const showModal = ref(false);

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(dateString).toLocaleString(undefined, options)
}

const fetchABook = async () => {
  console.log("Fetching book...");
  try {
    const { data } = await axios.get(`http://localhost:3000/api/book/${id}`);
    bookData.value = data;

    console.log("Book data:", data);
  } catch (error) {
    console.error("Error fetching book:", error);
  }
};

const fetchChapters = async () => {
  console.log("Fetching chapters...");
  try {
    const { data } = await axios.get(`http://localhost:3000/api/chapter/${id}`);
    chapters.value = data;
    console.log("Chapters data:", data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};

const deleteBook = async () => {
  if (deletePhrase.value === "delete") {
    try {
      await axios.delete(`http://localhost:3000/api/book/delete/${id}`);
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

onMounted(() => {
  fetchABook();
  fetchChapters();
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
