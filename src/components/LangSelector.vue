<template>
  <div v-if="languages" class="flex justify-center text-sm">
    <select
      v-model="selectedLang"
      @change="changeLang"
      class="rounded-md bg-glass text-sm font-medium text-slate-100 hover:bg-slate-600/20 p-4"
    >
      <option
        class="p-4 bg-slate-900 rounded-sm"
        v-for="(lang, key) in languages"
        :key="key"
        :value="key"
      >
        {{ lang }}
      </option>
    </select>
  </div>
  <div v-else>
    <p>Loading languages...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { i18n } from './../lang/langConfig'

const languages = {
  en: 'EN',
  es: 'ES'
}

const selectedLang = ref(i18n.global.locale)

const router = useRouter()

const changeLang = () => {
  Cookies.set('lang', selectedLang.value)
  router.go(0)
}
</script>

<style scoped>
/* Add any additional styles here */
option {
  padding: 5vh;
}
</style>
