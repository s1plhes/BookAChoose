<script setup>
import { RouterLink } from 'vue-router'
import { user } from '../mixins/authMixin'
import logo from '@/icons/logo.svg'
</script>

<template>
  <nav>
    <div
      class="grid grid-cols-1 lg:grid-cols-4 justify-center items-center max-w-6xl mx-auto gap-4 p-4"
    >
      <div id="nav-logo">
        <a href="/">
          <img :src="logo" title="book-a-choose" />
        </a>
      </div>
      <div id="searchBar">
        <SearchBar class="z-20" />
      </div>
      <div id="navBar" class="text-white">
        <ul class="flex gap-4 text-xl justify-center">
          <li>
            <RouterLink
              activeClass="text-yellow-400"
              exactActiveClass="text-yellow-400"
              class="nav-link hover:text-yellow-300"
              :to="`/`"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <RouterLink
              activeClass="text-yellow-400"
              exactActiveClass="text-yellow-400"
              class="nav-link hover:text-yellow-300"
              :to="`/Books`"
            >
              Books
            </RouterLink>
          </li>
          <li>
            <RouterLink
              activeClass="text-yellow-400"
              exactActiveClass="text-yellow-400"
              class="nav-link hover:text-yellow-300"
              :to="`/About`"
            >
              About
            </RouterLink>
          </li>
        </ul>
      </div>
      <div id="userBar" class="px-4">
        <ul class="flex gap-4 text-white justify-center items-center">
          <li class="space-x-2" v-if="user">
            <UserMenu :placeholder="user.name">
              <li v-if="user.role === 'admin'">
                <RouterLink :to="`/hk`" class="block px-4 py-2 hover:bg-slate-950"
                  >Admin
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="`/${user.name}`" class="block px-4 py-2 hover:bg-slate-950"
                  >Profile
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="`/settings`" class="block px-4 py-2 hover:bg-slate-950"
                  >Settings
                </RouterLink>
              </li>

              <li>
                <RouterLink class="block px-4 py-2 hover:bg-red-900" :to="`/logout`"
                  >Logout</RouterLink
                >
              </li>
            </UserMenu>
          </li>
          <li v-else>
            <RouterLink
              class="nav-link text-lg text-yellow-500 hover:text-yellow-300"
              :to="`/Login`"
              >Login{{ Messages }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scope>
@media (max-width: 1024px) {
  #nav-logo {
    display: none;
  }
}
</style>
