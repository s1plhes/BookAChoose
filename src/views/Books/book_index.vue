<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { user } from "../../mixins/authMixin";
import { Head } from '@unhead/vue/components';
import FullBookCard from "@/components/fullBookCard.vue";

const books = ref([]);
const status = ref("");
const chaptersCount = ref(0);
const API_URL = import.meta.env.VITE_APP_API;
const fetchBooks = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/books`);
    books.value = data;
    chaptersCount.value = data.length;
  } catch (error) {
    console.error("Error fetching books:", error);
    status.value = `Error fetching books: ${error.message}`;
  }
};

onMounted(fetchBooks);
</script>

<template>

  <Head>
    <title>{{ $t('books.title') }} | {{ SITE_NAME }}</title>
    <meta name="robots" content="index,follow" />
  </Head>

  <div class="px-6 max-w-6xl mx-auto">
    <!-- Books Section -->
    <div class="text-slate-100">
      <h1 class="text-2xl font-bold mb-4 text-white text-start">
        {{ $t('books.title') }}
      </h1>
      <h2>{{ $t('books.subtitle') }}</h2>
    </div>

    <Separator />

    <div class="flex mb-2">
      <Btn v-if="user" variant="primary" :href="`/book/create`">{{ $t('books.createBtn') }}</Btn>
      <p v-else class="text-slate-100 text-xl">
        <Btn class="text-xl" :href="`/register`">{{ $t('account.register') }}</Btn> {{ $t('books.signUpLabel') }}.
      </p>
    </div>

    <div v-if="status" class="flex justify-center">
      <p class="text-red-500">{{ status }}</p>
    </div>

    <div v-else class="flex justify-center items-center mx-auto">
      <div class="grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        <div v-for="book in books" :key="book.id" class="p-1">
          <FullBookCard :book="book" :style="`${book.image}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
