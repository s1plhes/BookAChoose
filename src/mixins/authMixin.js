// src/mixins/authMixin.js
import Cookies from 'js-cookie'
import { ref } from 'vue'

export const user = ref(null)

export const decodeJWT = (token) => {
  if (!token) return null
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

export default {
  created() {
    const token = Cookies.get('accessToken')
    if (token) {
      try {
        user.value = decodeJWT(token)
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    }
  }
}
