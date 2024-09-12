import { user } from '@/mixins/authMixin'

// src/store/user.js

export const loginUser = (userData) => {
  user.value = userData // Set user data on login
}

export const logoutUser = () => {
  user.value = null // Clear user data on logout
}
