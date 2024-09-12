<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import Cookies from 'js-cookie'

const accountsData = ref([])
const accountsCount = ref(0)
const error = ref('')

const getAllUsers = async () => {
  const token = Cookies.get('accessToken')
  if (!token) {
    toast.error(`No Auth token ${error.value}`, {
      autoClose: false
    })
    return
  }
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/users`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    accountsData.value = data
    accountsCount.value = data.length
  } catch (error) {
    toast.error(`ERROR: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: false,
      theme: 'dark'
    })
  }
}

onMounted(getAllUsers)
</script>
<template>
  <section class="bg-glass text-white p-6">
    <CoolBtn href="/hk" variant="danger"
      ><i class="fa-solid fa-person-walking-arrow-right"></i
    ></CoolBtn>
    <div v-if="accountsData" class="font-sans overflow-x-auto">
      <h1 class="text-2xl mb-6">{{ SITE_NAME }}'s users list</h1>
      <h1 class="text-2xl mb-6">Account registered: {{ accountsCount }}</h1>
      <table class="gap-4 min-w-full bg-slate-800 text-white p-4">
        <thead class="whitespace-nowrap bg-slate-950">
          <tr>
            <th class="p-4 text-left text-sm font-medium">id</th>
            <th class="p-4 text-left text-sm font-medium">name</th>
            <th class="p-4 text-left text-sm font-medium">email</th>
            <th class="p-4 text-left text-sm font-medium">role</th>
            <th class="p-4 text-left text-sm font-medium">actions</th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">
          <tr
            v-for="account in accountsData"
            :key="account.id"
            class="even:bg-slate-900 text-lg hover:bg-slate-700"
          >
            <td class="p-4 text-sm text-white">{{ account.id }}</td>
            <td class="p-4 text-sm text-white">{{ account.name }}</td>
            <td class="p-4 text-sm text-white">{{ account.email }}</td>
            <td class="p-4 text-sm text-white">{{ account.role }}</td>
            <td class="p-4 text-sm text-white space-x-4">
              <RouterLink class="text-xl text-gray-500" :to="`/hk/manage-users/${account.id}`"
                ><i class="fa-solid fa-pen-to-square"></i
              ></RouterLink>

              <RouterLink class="text-xl text-red-500" :to="`/hk/manage-users/${account.id}/delete`"
                ><i class="fa-solid fa-trash-can"></i
              ></RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CoolBtn href="/hk" variant="danger"
      ><i class="fa-solid fa-person-walking-arrow-right"></i
    ></CoolBtn>
  </section>
</template>
