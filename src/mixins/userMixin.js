import { ref } from 'vue'
import { user } from './authMixin'
import { toast } from 'vue3-toastify'

export const Admin = ref(null)
export const userMixin = {
  computed: {
    user() {
      return user.value
    }
  }
}

export const isAdmin = (user) => {
  if (user.value.role === 'admin') {
    return true
  } else {
    toast.error('error')
  }
}
