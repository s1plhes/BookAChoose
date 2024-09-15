<script setup>
import { ref, onMounted } from 'vue'
import { user } from '../../mixins/authMixin'
import { Head } from '@unhead/vue/components'
import { BookService } from '@/services/bookService'

const bookService = new BookService()

const books = ref([])
const randBooks = ref([])
const tags = ref([])
const status = ref('')

onMounted(async () => {
  books.value = await bookService.getBooks()
  tags.value = await bookService.getTags()
  randBooks.value = await bookService.getFourBooks()
})
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
    <div class="flex mb-2">
      <Btn v-if="user" variant="yellow" :href="`/book/create`">{{ $t('books.createBtn') }}</Btn>
      <p v-else class="text-slate-100">
        <Btn class="text-md text-black" variant="yellow" :href="`/register`">{{
          $t('account.register')
        }}</Btn>
        {{ $t('books.signUpLabel') }}.
      </p>
    </div>

    <p class="mx-auto text-white items-center text-center">
      <span
        for="tag"
        v-for="tag in tags"
        :key="tag.id"
        class="text-slate-100 space-x-6 inline-flex justify-center"
      >
        <Btn class="text-xs text-black mr-2 leading-loose" :href="`/books/${tag.tag}`">{{
          tag.tag
        }}</Btn>
      </span>
    </p>

    <div v-if="status" class="flex justify-center">
      <p class="text-red-500">{{ status }}</p>
    </div>

    <div v-else class="bg-glass p-4 flex justify-center items-center mx-auto">
      <div
        class="grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1"
      >
        <div v-for="book in randBooks" :key="book.id" class="p-1">
          <FullCard :book="book" :style="`${book.image}`" />
        </div>
      </div>
    </div>

    <p class="text-slate-100 text-3xl text-center my-4">ALL BOOKS</p>
    <div v-if="status" class="flex justify-center">
      <p class="text-red-500">{{ status }}</p>
    </div>
    <div v-else class="flex justify-center items-center mx-auto">
      <div
        class="grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1"
      >
        <div v-for="book in books" :key="book.id" class="p-1">
          <FullCard :book="book" :style="`${book.image}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
