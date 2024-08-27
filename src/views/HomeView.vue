<script setup>
import Upload from '@/components/upload.vue';
import { user } from '@/mixins/authMixin';
import Cookies from 'js-cookie';
const usercookies = Cookies.get('name');
</script>
<template>
  <div class="text-slate-100 min-h-screen min-w-full">
    <Logo class="mx-auto" colour="#FEFFFA" width="300px" />
    <blockquote class="text-2xl font-semibold italic text-center text-slate-50">
      Just pick a
      <span
        class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block">
        <span class="relative text-black">Book</span>
      </span>, here's lot to <span
        class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block">
        <span class="relative text-black">Choose</span>
      </span>
    </blockquote>
    <MotionGroup preset="slideVisibleLeft" :duration="600">

      <div class="w-full bg-white h-full min-h-1/2 mt-6 text-slate-950 p-3  text-center">
        <h1 class="text-2xl ubuntu-bold mb-6 ">{{ $t('message.hello') }}</h1>

      </div>
    </MotionGroup>
  </div>
</template>
