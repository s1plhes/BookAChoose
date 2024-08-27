<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const Goback = () => {
    router.go(-1)
}
</script>
<template>
    <button @click="Goback()"><span class="text-yellow-500 text-lg">← Back</span></button>
</template>