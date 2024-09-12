<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import Footer from './views/footerView.vue'
import { useHead } from '@unhead/vue'

const notificationVisible = ref(false)
const notificationMessage = ref('')
const showModal = ref(false)

useHead({
  title: import.meta.env.VITE_APP_NAME
})
</script>

<template>
  <NavigationBar class="w-full" />
  <!--Main Content-->
  <main class="pb-20 flex-grow">
    <RouterView class="max-w-6xl mx-auto -z-20" />

    <SearchModal
      class="z-50 w-fit"
      :showModal="showModal"
      title="Delete Book"
      @update:showModal="showModal = $event"
    >
      search
    </SearchModal>
  </main>

  <Footer />

  <Notification :message="notificationMessage" :visible="notificationVisible" />
</template>
