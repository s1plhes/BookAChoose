<template>
  <section class="bg-glass max-w-6xl p-4 flex text-white">
    <div class="block">
      <p>Site API = {{ API }}</p>
      <p>App URL = {{ app_url }}</p>
      <p>App Mode = {{ app_mode }}</p>
      <Btn W="1/4" href="/hk" variant="danger">Back</Btn>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
const API = import.meta.env.VITE_API
const app_url = import.meta.env.VITE_APP_URL
const app_mode = import.meta.env.VITE_NODE_ENV

onMounted(async () => {})
</script>
