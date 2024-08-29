<script setup>
import { user } from "@/mixins/authMixin";
import Cookies from "js-cookie";
const usercookies = Cookies.get("name");
</script>
<template>
  <section class="w-full min-w-full">
    <div class="text-slate-100 -z-20">
      <Logo class="mx-auto" colour="#FEFFFA" width="300px" />
      <blockquote class="text-2xl font-semibold italic text-center text-slate-50">
        Just pick a
        <span
          class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block">
          <span class="relative text-black">Book</span> </span>, here's lot to
        <span
          class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block">
          <span class="relative text-black">Choose</span>
        </span>
      </blockquote>
      <MotionGroup preset="slideVisibleRight" :duration="200">


        <div class="w-full bg-white h-2/3 min-h-1/2 text-black p-6 mt-6 text-center">
          <div class="grid grid-cols-2 mx-auto space-x-3 justify-center items-center max-w-4xl p-6">
            <div><img src="../assets/HAPPY.svg" class="hover:animate-ping" width="170px my-4"></div>
            <div>
              <h2 class="text-4xl">Read makes you happy?❤️</h2>
              <h3 class="text-2xl mb-4">Find lots of LOVELY stories to read</h3>
              <Btn variant="yellow" class="text-2xl" href="/books">Let's go →</Btn>
            </div>
          </div>

        </div>

      </MotionGroup>
      <div>


      </div>
    </div>
  </section>
</template>
