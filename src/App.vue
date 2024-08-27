<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { user } from './mixins/authMixin'
import logo from '@/icons/logo.svg'
import { useHead } from '@unhead/vue'
import Cookies from 'js-cookie'

const username = Cookies.get('username')
const notificationVisible = ref(false)
const notificationMessage = ref('')
const showModal = ref(false)

useHead({
  title: 'Book-A-Choose'
})

</script>

<template>
  <!--Main Navigation-->
  <nav
    class="text-white shadow-md bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 xl:sticky top-0 z-20 sm:py-3">
    <div class="">
      <div
        class="pt-4 grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 justify-center items-center mx-auto max-w-6xl sm:px-6 lg:px-8">
        <div class="flex justify-center">
          <a href="/">
            <img :src="logo" title="book-a-choose" />
          </a>
        </div>
        <div class="flex justify-center">
          <SearchBar class="z-50" />
        </div>
        <div class="flex justify-center sm:mb-4">
          <ul class="flex items-center space-x-4">
            <li>
              <RouterLink activeClass="text-yellow-400" exactActiveClass="text-yellow-400"
                class="nav-link hover:text-yellow-300" :to="`/`">
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink activeClass="text-yellow-400" exactActiveClass="text-yellow-400"
                class="nav-link hover:text-yellow-300" :to="`/Books`">
                Books
              </RouterLink>
            </li>
            <li>
              <RouterLink activeClass="text-yellow-400" exactActiveClass="text-yellow-400"
                class="nav-link hover:text-yellow-300" :to="`/About`">
                About
              </RouterLink>
            </li>
            <li class="space-x-2" v-if="user">
              <UserMenu :placeholder="user.name">
            <li>
              <RouterLink :to="`/${user.name}`" class="block px-4 py-2 hover:bg-slate-950">Profile</RouterLink>
            </li>
            <li>
              <a class="block px-4 py-2 hover:bg-slate-950" href="/settings">Settings</a>
            </li>
            <li><a href="#" class="block px-4 py-2 hover:bg-slate-950">Security</a></li>
            <li>
              <RouterLink class="block px-4 py-2 hover:bg-slate-950" :to="`/logout`">logout</RouterLink>
            </li>
            </UserMenu>
            </li>
            <li v-else>
              <RouterLink class="nav-link hover:text-yellow-300" :to="`/Login`">Login{{ Messages }}</RouterLink>
            </li>
            <li>
              <LangSelector />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <!--Main Navigation-->

  <!--Main Content-->
  <main class="">
    <RouterView class="min-h-screen max-w-6xl mx-auto bg-slate-900/20 backdrop-blur-sm" />
  </main>
  <SearchModal :showModal="showModal" title="Delete Book" @update:showModal="showModal = $event">
    search
  </SearchModal>
  <Notification :message="notificationMessage" :visible="notificationVisible" />
</template>
