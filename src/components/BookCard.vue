<script setup lang="ts">
/**
 * A card component to display a book.
 * @param {{ title: string, author: string, description: string, id: number }} book
 * @param {string} [cover='https://i.imgur.com/n0IPqbB.png']
 * @returns {import('vue').VNode}
 */
defineProps<{
  book: { title: string; author: string; description: string; id: number };
  cover?: string;
}>();
</script>

<template>
  <article class="p-4 rounded-md shadow-lg space-y-4 max-w-md mx-auto backdrop-blur-sm bg-slate-800/30">
    <div class="space-y-2">
      <h1 class="text-xl font-bold font-mono text-white">{{ book.title }}</h1>

      <p class="text-gray-300 font-mono">
        <a :href="`/${book.author}`">by {{ book.author }}</a>
      </p>
    </div>
    <div class="flex justify-center items-center">
      <img class="w-full h-auto max-w-xs md:max-w-md rounded-lg object-cover" :src="cover" alt="Book Cover" />
    </div>
    <footer class="flex justify-center mt-6">
      <Btn variant="primary" :href="`/book/${book.id}`"> Read this book </Btn>
    </footer>
  </article>
</template>

<style scoped>
/* Optional: Add any custom styling here if needed */
</style>
