import axios from "axios";
import { toast } from 'vue3-toastify'
import Cookies from 'js-cookie'
import { ref } from "vue";



const token = Cookies.get('accessToken')
export class BookService {
  async getBooks() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/books`);
      return response.data
    } catch (error) {
      toast.error(`Error fetching books: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      })
    }
  }
  async getFourBooks() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/books/1/4`);
      return response.data
    } catch (error) {
      toast.error(`Error fetching books: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      })
    }
  }

  async getChaptersByBookId(id) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/allchapters/${id}`)

      return response.data

    } catch (error) {
      if (error.response.status === 404) {
        return []
      }
      toast.error(`Error fetching chapters: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      })
    }

  }

  async getBookById(id) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/book/${id}`)
      const chapters = await this.getChaptersByBookId(id)
      const alldata = { ...response.data, chapters }
      return alldata
    } catch (error) {
      toast.error(`Error fetching book: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      })
    }
  }

  async getTags() {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/books/tags`)
      return data
    } catch (error) {
      toast.error(`Error fetching books: ${error.message}`, {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark'
      })
    }
  }
  async getBookLikes(id) {
    try {
      const { data: { likes } } = await axios.get(`${import.meta.env.VITE_API}/count/likes/${id}/0`)
      return typeof likes === 'number' ? likes : null
    } catch (error) {
      console.error('Error getting likes', error)
      return null
    }
  }

  async deleteBook(id) {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API}/book/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data; // Retornas el resultado de la operación
    } catch (error) {
      throw error; // Dejas que el componente maneje el error
    }
  }

  async createBook(bookData, image) {
    const token = Cookies.get('accessToken');
    if (!token) {
      throw new Error('Authorization token is missing. Please log in again.');
    }
    const { data } = await axios.post(
      `${import.meta.env.VITE_API}/book/create`,
      {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        tags: bookData.tags,
        image: image
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return data;
  }
}

