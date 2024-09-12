<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Head } from '@unhead/vue/components'
import { useRoute } from 'vue-router'

const books = ref([])
const status = ref('')
const chaptersCount = ref(0)
const route = useRoute()

const fetchBooks = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/books/${route.params.tag}`)
    books.value = data
    chaptersCount.value = data.length
  } catch (error) {
    console.error('Error fetching books:', error)
    status.value = `Error fetching books: ${error.message}`
  }
}

onMounted(fetchBooks)
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
      <h2>All books with tag: "{{ route.params.tag }}"</h2>
    </div>

    <SepaRator />

    <div class="flex mb-2">
      <Btn href="/books">back</Btn>
    </div>

    <div v-if="status" class="flex justify-center">
      <p class="text-red-500">{{ status }}</p>
    </div>

    <div v-else class="flex justify-center items-center mx-auto">
      <div class="grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        <div v-for="book in books" :key="book.id" class="p-1">
          <FullCard :book="book" :style="`${book.image}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
