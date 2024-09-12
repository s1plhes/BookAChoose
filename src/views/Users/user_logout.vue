<script setup>
import { user } from '@/mixins/authMixin'
import { checkAuth } from '@/plugins/checkAuth'
import axios from 'axios'
import Cookies from 'js-cookie'
import { onMounted, ref } from 'vue'

const message = ref('')
const error = ref('')

const logout = async () => {
  const token = Cookies.get('accessToken')
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200) {
      localStorage.clear()
      Cookies.remove('accessToken')
      Cookies.remove('avatar')
      Cookies.remove('name')
      //Cookies.remove('user');
      message.value = 'You have been logged out successfully!'
      setTimeout(() => {
        window.location.href = '/login'
      }, 800)
    } else {
      error.value = response.data.message || 'Unknown error'
    }
  } catch (err) {
    console.error('Logout error:', err)
    error.value = err.response?.data?.message || 'Logout failed :('
  }
}

onMounted(() => {
  logout()
  checkAuth(user)
})
</script>

<template>
  <div class="logout-container">
    <h1 class="text-2xl font-bold text-slate-200 mt-12">Logout Process</h1>
    <p v-if="message" class="text-green-500">{{ message }}</p>
    <p v-if="error" class="text-red-500">Logout failed: {{ error }}</p>
  </div>
</template>

<style scoped>
.logout-container {
  color: white;
  text-align: center;
  margin-top: 50px;
}
</style>
