import { user } from '@/mixins/authMixin'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export const checkAuth = (user) => {
  const router = useRouter()
  if (!user.value) {
    router.push('/403')
  }
}

//Checks if users role is banned then unauthorized him to access to every page in site
export const checkBanned = () => {
  const router = useRouter()
  if (user.role == 'ban') {
    router.push('/403')
    toast.error(`YOU ARE BANNED`, {
      autoClose: false
    })
  }
}
