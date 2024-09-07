<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import Footer from "./views/footer.vue";
import Navbar from "./components/Navbar.vue";
import { useHead } from "@unhead/vue";

const notificationVisible = ref(false);
const notificationMessage = ref("");
const showModal = ref(false);

useHead({
  title: import.meta.env.VITE_APP_NAME,
});
</script>

<template>

  <Navbar class="w-full" />
  <!--Main Content-->
  <main class="pb-20">
    <RouterView class="h-screen max-w-6xl mx-auto -z-20" />
  </main>


  <Footer />
  <SearchModal class="z-50" :showModal="showModal" title="Delete Book" @update:showModal="showModal = $event">
    search
  </SearchModal>
  <Notification :message="notificationMessage" :visible="notificationVisible" />
</template>
