<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      author: '',
      description: '',
      id: 0,
      image: ''
    })
  },
  style: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <article
    class="p-4 rounded-md shadow-lg space-y-4 max-w-md mx-auto backdrop-blur-sm bg-slate-800/30"
  >
    <div class="space-y-2">
      <h1 class="text-xl font-bold font-mono text-white">{{ book.title }}</h1>

      <p class="text-gray-300 font-mono">
        <a :href="`/${book.author}`">by {{ book.author }}</a>
      </p>
    </div>
    <div class="flex justify-center items-center">
      <img
        class="w-full h-auto max-w-xs md:max-w-md rounded-lg object-cover"
        :src="book.image"
        alt="Book Cover"
      />
    </div>
    <footer class="flex justify-center mt-6">
      <Btn variant="primary" :href="`/book/${book.id}`"> Read this book </Btn>
    </footer>
  </article>
</template>
