// src/services/bookService.js
import { computed } from 'vue'
import { axiosGet, useFetch } from './apiService.js'

const baseUrl = import.meta.env.VITE_API

export const fetchBooks = () => useFetch(baseUrl + '/books')

export const getBooks = () => {
  const url = computed(() => baseUrl + '/books')
  const { data, error } = useFetch(url.value.data)
  return { data, error }
}

export const getChapterById = (bookId, chapterId) => {
  const url = `${baseUrl}/book/${bookId}/chapter/${chapterId}`
  return axiosGet(url)
}

export default { fetchBooks, getChapterById }
