// src/services/apiService.js
import axios from 'axios'
import { ref, watchEffect } from 'vue'

export async function axiosGet(url) {
  const data = ref('')
  const error = ref('')

  try {
    const response = await axios.get(url)
    data.value = response.data
  } catch (e) {
    error.value = e
  }

  return { data, error }
}

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  watchEffect(async () => {
    data.value = null
    error.value = null
    try {
      const response = await fetch(url)
      console.log('Fetch Response:', await response.json()) // Log response before setting data
      data.value = await response.json()
    } catch (e) {
      error.value = e
    }
  })

  return { data, error }
}
