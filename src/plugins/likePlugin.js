// src/plugins/LikeSystem.js
import axios from 'axios'
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { toast } from 'vue3-toastify'

const token = Cookies.get('accessToken')

export default {
  install: (app) => {
    const likeData = ref({ liked: false })

    const fetchLike = async (userId, bookId, chapterId) => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        )
        likeData.value.liked = data.liked
      } catch (error) {
        toast.error(`Likes:'${error}'`, {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }
    }

    const Like = async (userId, bookId, chapterId) => {
      const token = Cookies.get('accessToken')
      if (!token) {
        return toast.error('Authorization token is missing.', {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }

      try {
        await axios.post(`${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        likeData.value.liked = true
        toast.success('Book liked successfully', {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      } catch (error) {
        toast.error(`Likes:'${error}'`, {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }
    }

    const DelLike = async (userId, bookId, chapterId) => {
      const token = Cookies.get('accessToken')
      if (!token) {
        return toast.error('Authorization token is missing.', {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }
      try {
        await axios.delete(`${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        toast.success('Book unliked successfully', {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
        likeData.value.liked = false
      } catch (error) {
        toast.error(`Likes: '${error}'`, {
          autoClose: false,
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        })
      }
    }

    // Expose the methods globally
    app.config.globalProperties.$likeSystem = {
      likeData,
      fetchLike,
      Like,
      DelLike
    }
  }
}
