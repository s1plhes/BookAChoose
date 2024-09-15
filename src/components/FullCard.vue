<script setup>
import { ref } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      author: '',
      description: '',
      id: 0
    })
  },
  style: {
    type: String,
    default: ''
  }
})

const visibility = {
  visible: 'visible',
  hidden: 'invisible'
}

const visible = ref(visibility.hidden)
const switchVisibility = () => {
  visible.value = visible.value === visibility.visible ? visibility.hidden : visibility.visible
}

const { title, author, description, id } = props.book
</script>

<template>
  <article
    class="relative p-4 rounded-lg shadow-lg space-y-4 max-w-[20vw] mx-auto bg-center bg-no-repeat bg-cover min-h-48"
    :style="`background:  url(${style}); background-size: cover; min-height: 35.5vmin;`">
    <div :class="`${visible}`">
      <div class="space-y-2 bg-slate-900/30 backdrop-blur-md rounded-md py-8 px-4 text-slate-100">
        <h1 class="text-2xl font-bold font-mono line-clamp-2 leading-tight tracking-wide">
          {{ title }}
        </h1>
        <p class="font-mono">
          <a :href="`/${author}`" class="hover:underline"> by {{ author }} </a>
        </p>
        <div :class="` text-white text-base line-clamp-5 leading-relaxed`">
          <p>{{ description }}</p>
        </div>
      </div>
      <footer class="relative inset-x-0 bottom-0 flex justify-center mt-4"></footer>
    </div>
    <div class="w-full flex bg-slate-900/20 rounded-2xl px-2 items-center justify-between">
      <button @click="switchVisibility" class="text-white text-2xl">
        <i class="fa-solid fa-eye"></i>
      </button>
      <Btn variant="yellow" :href="`/book/${id}`" :class="`px-6 py-2 my-3 text-lg rounded-full`">
        Read
      </Btn>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
