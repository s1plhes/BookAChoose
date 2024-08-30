<script setup lang="js">

import { RouterLink } from "vue-router";
import { user } from "../mixins/authMixin";
import logo from "@/icons/logo.svg";
</script>

<template>
    <!--Main Navigation-->
    <nav class="xl:sticky xs:sticky text-white shadow-md bg-transparent backdrop-filter
     backdrop-blur-lg bg-opacity-30 top-0 z-40  sm:mx-6 mx-6">
        <div class="">
            <div class=" grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 justify-center
         items-center mx-auto max-w-6xl sm:px-6 lg:px-8">
                <div class="flex justify-center">
                    <a href="/">
                        <img :src="logo" title="book-a-choose" />
                    </a>
                </div>
                <div class="flex justify-center">
                    <SearchBar class="z-20" />
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
                            <RouterLink :to="`/${user.name}`" class="block px-4 py-2 hover:bg-slate-950">Profile
                            </RouterLink>
                        </li>
                        <li>
                            <a class="block px-4 py-2 hover:bg-slate-950" href="/settings">Settings</a>
                        </li>
                        <li>
                            <a href="#" class="block px-4 py-2 hover:bg-slate-950">Security</a>
                        </li>
                        <li>
                            <RouterLink class="block px-4 py-2 hover:bg-red-900" :to="`/logout`">Logout</RouterLink>
                        </li>
                        </UserMenu>
                        </li>
                        <li v-else>
                            <RouterLink class="nav-link hover:text-yellow-300" :to="`/Login`">Login{{ Messages }}
                            </RouterLink>
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
</template>