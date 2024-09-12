<script setup>
import { user } from '@/mixins/authMixin'
import { checkAuth } from '@/plugins/checkAuth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import Cookies from 'js-cookie'

const router = useRouter()
const usersCount = ref(null)

const menu = [
  { name: 'site', url: '/hk/manage-site' },
  { name: 'users', url: '/hk/manage-users' },
  { name: 'books', url: '/hk/manage-books' },
  { name: 'chapters', url: '/hk/manage-chapters' },
  { name: 'tags', url: '/hk/manage-tags' }
]

onMounted(async () => {
  const token = Cookies.get('accessToken')

  if (!token) {
    toast.error(`No Auth token`, {
      autoClose: false
    })
    return
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API}/userscount`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    usersCount.value = response.data[0].count
  } catch (error) {
    toast.error(`'Fatal error'`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false,
      onClose: () => router.go(0),
      theme: 'dark'
    })
  }

  checkAuth(user)
})
</script>

<template>
  <section>
    <h1 class="text-white text-4xl">Administration centre</h1>
    <div class="max-w-8xl bg-glass p-4">
      <div></div>
      <div class="grid grid-cols-4 text-white">
        <div>
          <ul class="px-3">
            <li v-for="item in menu" key="item.id">
              <Btn class="uppercase" W="full" :href="item.url">{{ item.name }}</Btn>
            </li>
          </ul>
        </div>
        <div class="col-span-2 p-4">
          <h1 class="text-white text-2xl">Overview</h1>
          <p>Hello {{ user.name }}, welcome to the administration centre</p>
        </div>
        <div>
          Metrics
          <ul>
            <li v-if="usersCount" class="p-2 border rounded-lg">
              Total Users
              <p>{{ usersCount }} users</p>
            </li>
            <li class="p-2 border rounded-lg">Last User</li>
            <li class="p-2 border rounded-lg">Total Books</li>
            <li class="p-2 border rounded-lg">Last Book</li>
            <li class="p-2 border rounded-lg">Total Chapters</li>
            <li class="p-2 border rounded-lg">Last Chapter</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
