<script setup></script>

<template>
  <section class="w-full min-w-full">
    <div class="text-slate-100 -z-20 mb-2">
      <Logo class="mx-auto" colour="#FEFFFA" width="300px" />
      <blockquote class="text-2xl font-semibold italic text-center text-slate-50">
        Some
        <span
          class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block"
        >
          <span class="relative text-black">Book</span> </span
        >'s, to
        <span
          class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-500 relative inline-block"
        >
          <span class="relative text-black">Choose</span>
        </span>
      </blockquote>
    </div>
  </section>

  <section class="body-font">
    <div class="container mx-auto flex md:px-24 md:py-2 md:flex-row flex-col items-center">
      <div
        class="bg-white p-4 rounded-lg w-max-2xl lg:flex-grow mt-5 md:mt-0 md:w-1.5/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
      >
        <h1
          class="text-2xl font-extrabold leading-9 tracking-tight mb-3 text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-normal"
        >
          Read makes you <a class="underline decoration-red-500">HAPPY?</a>❤️
        </h1>
        <p class="mb-8 md:pl-0 pl-2 pr-2 leading-relaxed text-gray-800">
          Short description here, Short description here Short description here Short description
          here Short description here Short description here.
        </p>
        <div class="flex justify-center gap-4 text-black">
          <Btn class="text-center" variant="yellow" :href="`/books`">Explore</Btn>
          <Btn class="text-center" variant="yellow" :href="`/login`">Join now</Btn>
        </div>
      </div>
      <div class="lg:max-w-lg lg:w-full mb-5 md:mb-0 md:w-1/2 w-3/6">
        <img class="object-cover object-center rounded" alt="hero" src="../assets/images/b1.svg" />
      </div>
    </div>
  </section>
</template>
