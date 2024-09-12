<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import FullBookCard from '@/components/fullCard.vue'

const books = ref([])
const loading = ref(false)
const hasMore = ref(true)

const loadBooks = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const response = await axios.get('http://localhost:3000/api/books')
    const newBooks = response.data

    if (newBooks.length === 0) {
      hasMore.value = false
    } else {
      books.value = [...books.value, ...newBooks]
    }
  } catch (error) {
    console.error('Error loading books:', error)
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight

  if (scrollTop + windowHeight >= scrollHeight - 100 && hasMore.value) {
    loadBooks()
  }
}

onMounted(() => {
  loadBooks()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="text-slate-100 min-h-screen min-w-full bg-gray-900">
    <Logo class="mx-auto my-8" colour="#FEFFFA" width="300px" />
    <blockquote class="text-2xl font-semibold italic text-center text-slate-50">
      Just pick a
      <span
        class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block"
      >
        <span class="relative text-black">Book</span> </span
      >, here's lot to
      <span
        class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block"
      >
        <span class="relative text-black">Choose</span>
      </span>
    </blockquote>

    <MotionGroup preset="slideVisibleLeft" :duration="600">
      <div class="w-full h-full min-h-1/2 mt-6 text-slate-950 p-3 flex flex-col items-center">
        <h1 class="text-2xl font-bold mb-6">Hola!</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="book in books" :key="book.id" class="p-1">
            <FullBookCard :book="book" :style="`${book.image}`" />
          </div>
        </div>

        <div v-if="loading.value" class="text-center mt-4">
          <p class="text-gray-500">Loading...</p>
        </div>
        <div v-if="!hasMore.value && !loading.value" class="text-center mt-4">
          <p class="text-gray-500">No more books to load.</p>
        </div>
      </div>
    </MotionGroup>
  </div>
</template>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
