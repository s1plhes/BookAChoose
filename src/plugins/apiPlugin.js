import { ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'

export default {
  install: (app) => {
    const tags = ref([])

    app.config.globalProperties.$fetchTags = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API}/books/tags`)
        tags.value = data
      } catch (error) {
        toast.error(`Error fetching tags: ${error.message}`, {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }
      return tags
    }
  }
}
