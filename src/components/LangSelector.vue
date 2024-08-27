<template>
    <div v-if="languages" class="flex justify-center text-sm p-2">
        <select v-model="selectedLang" @change="changeLang" class="p-4 rounded-md bg-slate-800/40 backdrop-blur-md text-sm font-medium text-slate-100
                 hover:bg-slate-600/20 ">
            <option class="p-4 bg-slate-900 rounded-sm" v-for="(lang, key) in languages" :key="key" :value="key">
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
    en: 'English',
    es: 'Español',
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
