<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { user } from "../../mixins/authMixin";
import { Head } from '@unhead/vue/components'
import FullBookCard from "@/components/fullBookCard.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue"; // Importa el skeleton

const books = ref([]);
const loading = ref(true); // Estado de carga
const status = ref("");
const chapters = ref([]);
const fetchBooks = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/books`);
    books.value = response.data;
    chapters.value = books.value.length;
  } catch (error) {
    console.error("Error fetching books:", error);
    status.value = "Error fetching books: " + error
  } finally {
    loading.value = false; // Cambia el estado de carga cuando la llamada termina
  }
};

onMounted(() => {
  fetchBooks();
});
</script>

<template>

  <Head>
    <title> {{ $t('books.title') }} | {{ SITE_NAME }}</title>
    <meta name="robots" content="index,follow" />
  </Head>

  <div class="px-6 max-w-6xl mx-auto">
    <!-- Books Section -->
    <div class="text-slate-100">
      <h1 class="text-2xl font-bold mb-4 text-white text-start">
        {{ $t('books.title') }}
      </h1>
      <h2>
        {{ $t('books.subtitle') }}
      </h2>
    </div>

    <Separator />
    <div class="flex mb-2">
      <Btn v-if="user" variant="primary" :href="`/book/create`">{{ $t('books.createBtn') }}</Btn>
      <p class="text-slate-100 text-xl" v-else>
        <Btn class="text-xl" :href="`/register`">{{ $t('account.register') }}</Btn> {{ $t('books.signUpLabel') }}.
      </p>
    </div>

    <div v-if="loading"
      class="grid grid-cols-4 place-content-center sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
      <div v-for="n in 8" :key="n" class="p-2">
        <SkeletonLoader />
      </div>
    </div>

    <div class="flex justify-center items-center mx-auto" v-else>
      <div class="grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        <div v-for="book in books" :key="book.id" class="p-1">
          <FullBookCard :book :style="`${book.image}`" />
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div v-if="!loading && error">
        <p class="text-red-500">{{ error }}</p>
      </div>
      <div v-if="!loading && books.length === 0">
        <p class="text-red-500">{{ status }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped></style>
