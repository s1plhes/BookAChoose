<template>
  <Head>
    <title>Sign in | {{ SITE_NAME }}</title>
  </Head>
  <section class="grid lg:grid-cols-2 sm:grid-cols-1 mx-auto my-8 max-w-6xl">
    <!-- Background Image -->
    <div class="flex items-center justify-center">
      <Logo class="mx-auto" colour="#FEFFFA" width="300px" />
    </div>
    <!-- Login Form -->
    <div class="px-6">
      <div class="w-full space-y-4">
        <h1 class="text-2xl font-bold text-slate-200">Log in to your account</h1>
        <form class="space-y-4" @submit.prevent="login">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-slate-200 font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              v-model.trim="email"
              placeholder="Enter Email Address"
              class="input"
              autofocus
              autocomplete="on"
              required
            />
          </div>
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-slate-200 font-semibold">Password</label>
            <input
              type="password"
              id="password"
              v-model.trim="password"
              placeholder="Enter Password"
              minlength="8"
              autocomplete="on"
              class="input"
              required
            />
          </div>
          <!-- Forgot Password Link -->
          <div class="text-right">
            <a
              href="#"
              class="text-sm font-semibold text-slate-200 hover:text-yellow-700 focus:text-yellow-700"
              >Forgot Password?</a
            >
          </div>
          <!-- Submit Button -->
          <button type="submit" class="p-4 rounded-md bg-yellow-500 text-black w-full">
            Login
          </button>
        </form>
        <hr class="my-6 border-gray-300" />
        <!-- Google Login Button 
        <button type="button"
          class="w-full bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300 flex items-center justify-center transition duration-300 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-6 h-6"
            viewBox="0 0 48 48">
            <defs>
              <path id="a"
                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" overflow="visible" />
            </clipPath>
            <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
            <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
            <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
            <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
          </svg>
          <span class="ml-4">Log in with Google</span>
        </button>-->

        <!-- Sign-Up Link -->
        <p class="mt-8 text-center text-slate-200">
          Need an account?
          <a href="/register" class="text-yellow-500 hover:text-yellow-700 font-semibold"
            >Create an account</a
          >
        </p>

        <!-- Error and Success Messages -->
        <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-green-500 text-center">
          {{ successMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { user, decodeJWT } from '@/mixins/authMixin'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  if (Cookies.get('accessToken')) {
    toast.success('You are already logged in! Click me to proceed', {
      autoClose: false,
      onClose: () => router.push('/')
    })
  }
})

const validateForm = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Both email and password are required.'
    return false
  }
  return true
}

const login = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    const response = await axios.post(`${import.meta.env.VITE_API}/login`, {
      email: email.value,
      password: password.value
    })

    if (response.status === 200 && response.data.accessToken) {
      const accessToken = response.data.accessToken
      Cookies.set('accessToken', accessToken, { expires: 7 })

      const decodedJWT = decodeJWT(accessToken)
      if (decodedJWT && decodedJWT.userId) {
        const userResponse = await axios.get(`${import.meta.env.VITE_API}/${decodedJWT.name}/data`)

        if (userResponse.status === 200 && userResponse.data) {
          //dont push password into user object
          delete userResponse.data.password
          user.value = userResponse.data
          Cookies.set('avatar', user.value.avatar, { expires: 7 })
          Cookies.set('name', user.value.name, { expires: 7 })
          Cookies.set('user', JSON.stringify(user.value), { expires: 7 })
          toast.success(`Login successful! Click me to proceed`, {
            autoClose: false,
            onClose: () => router.push('/')
          })
        } else {
          toast.error('Failed to fetch user data.', {
            theme: 'dark'
          })
        }
      } else {
        toast.error('Invalid token or user ID.', {
          theme: 'dark'
        })
      }
    } else {
      toast.error('An unknown error occurred. Please try again.', {
        theme: 'dark'
      })
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Code:401, Invalid email or password.', {
            theme: 'dark'
          })
          break
        case 500:
          toast.error('Code:500, Server error, please try again later.', {
            theme: 'dark'
          })
          break
        default:
          toast.error('Code:unknown, An unknown error occurred. Please try again.', {
            theme: 'dark'
          })
      }
    } else {
      toast.error('Network error. Please check your connection', {
        theme: 'dark'
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Optional: Add any custom styling here if needed */
</style>
