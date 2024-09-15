<script setup>
import { ref, onMounted } from 'vue'
import { user } from '@/mixins/authMixin'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import CommentBox from '@/components/profile/pComment.vue'
import axios from 'axios'
import { Head } from '@unhead/vue/components'
import Cookies from 'js-cookie'
import { formatDate } from '@/plugins/formatDate'
import ErrorMessage from '@/components/ErrorMessage.vue'

const router = useRouter()
const route = useRoute()
const profileUser = ref('')
const profileUserName = route.params.username
const pid = ref('')
const comment = ref('')
const comments = ref([])
const newComment = ref('')
const replyTo = ref(null)
const error = ref('')
const commentError = ref('')
const componentKey = ref(0)

function buildCommentTree(comments, parentId = null) {
  const tree = []
  for (const comment of comments) {
    if (comment.parent_id === parentId) {
      const children = buildCommentTree(comments, comment.id)
      if (children.length) {
        comment.replies = children
      }
      tree.push(comment)
    }
  }
  return tree
}

// Manejar la respuesta a un comentario
/*
const setReply = (comment) => {
  replyTo.value = comment
}

const bookCount = ref(null)
const getBookCount = async (id) => {
  if (id) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/books/${id}/count`)
      bookCount.value = response.data.count
    } catch (error) {
      toast.error(`'${error}'`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
        onClose: () => router.go(0),
        theme: 'dark'
      })
    }
  }
}*/

const userBooks = ref([])
const fetchBooks = async (username) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/${username}/books`, {
      headers: {
        Authorization: `${Cookies.get('accessToken')}`
      }
    })
    userBooks.value = response.data
  } catch (error) {
    console.error(error)
  }
}

function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment
    }
    const found = findCommentById(comment.replies || [], id)
    if (found) {
      return found
    }
  }
  return null
}

// Agregar un nuevo comentario o respuesta
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/comment/p`,
        {
          userId: user.value.userId,
          profileName: profileUserName,
          body: newComment.value.trim(),
          parent_id: replyTo.value ? replyTo.value.id : null
        },
        {
          headers: {
            Authorization: `${Cookies.get('accessToken')}`
          }
        }
      )
      const newAddedComment = response.data.comment

      if (replyTo.value) {
        // Añadir la respuesta al comentario padre
        const parentComment = findCommentById(comments.value, replyTo.value.id)
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = []
          parentComment.replies.push(newAddedComment)
        }
      } else {
        // Añadir comentario al nivel superior
        comments.value.push(newAddedComment)
      }

      newComment.value = ''

      toast.success('Comment added!', {
        autoClose: 300,
        position: toast.POSITION.BOTTOM_RIGHT,
        onClose: () => router.go(0)
      })

      // **Trigger reactivity by replacing the comments array**
      comments.value = [...comments.value] // <-- This forces Vue to re-render
      componentKey.value += 1
      replyTo.value = null
    } catch (error) {
      commentError.value = 'Error:' + error
      console.error('Error adding comment:', error)
    }
  }
}

const fetchComments = async (id) => {
  if (pid.value) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/profile/comments/${id}`)
      comments.value = buildCommentTree(response.data)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  } else {
    console.log('Error: no id provided.')
  }
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API}/${profileUserName}/data`)
    const data = await response.json()
    if (response.status === 404) {
      router.push('/404')
    }

    profileUser.value = data
    pid.value = profileUser.value.id
    /* getBookCount(pid.value)*/
    fetchBooks(profileUser.value.name)
    fetchComments(profileUser.value.id)
  } catch (error) {
    toast.error(`"error ${error}"`)
  }
})
</script>

<template>

  <Head>
    <title>{{ profileUser.name }} on {{ SITE_NAME }}</title>
  </Head>
  <div v-if="error" class="text-yellow-500 text-3xl">{{ error }}</div>
  <div id="user-profile" class="min-h-screen text-white">
    <div class="container mx-auto">
      <!-- User Information Section -->
      <!--  H E A D E R  -->
      <div v-if="profileUser.header_image" class="bg-yellow-500 text-center w-full p-6 h-[350px]" :style="`background:url(${profileUser.header_image || 'default-cover.png'});
         background-size: cover;background-position: center;`"></div>
      <!--  H E A D E R  -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="col-start-1 block mx-auto pb-4 w-full">
          <!-- User Avatar -->
          <div class="bg-glass mb-4 p-4">
            <div class="flex justify-center">
              <img :src="profileUser.avatar || 'default-avatar.png'" alt="User Avatar"
                class="h-48 w-48 rounded-full border-4 border-white object-cover -translate-y-8" />
            </div>
            <!-- User Details -->
            <div class="text-center mt-4">
              <h1 class="text-3xl font-bold">{{ profileUser.name || 'USER.NAME' }}</h1>
              <div class="flex justify-center space-x-6 mt-4">
                <div class="text-sm">
                  <p class="font-semibold">Books</p>
                  <p>{{ bookCount || 0 }}</p>
                </div>
                <div class="text-sm">
                  <p class="font-semibold">Followers</p>
                  <p>{{ profileUser.followersCount || 0 }}</p>
                </div>
              </div>
            </div>
          </div>
          <!--Book List-->
          <div class="p-4 bg-glass">
            <h1>Book List</h1>
            <div v-if="userBooks == 0">
              <p>No books published yet</p>
            </div>
            <div>
              <div v-for="book in userBooks" :key="book.id" class="grid grid-cols-3 bg-slate-950 p-4 my-4 relative">
                <div class=""><img :src="book.image" class="h-[20vh]" /></div>
                <div class="col-span-2 p-4">
                  <p class="text-xl font-bold text-yellow-500">{{ book.title }}</p>
                  <p class="italic">By {{ book.author.name }}</p>
                  <p class="text-xs"><i class="fa fa-heart mr-2"></i>{{ book.likes }}</p>

                  <div class="text-xs">
                    <p>Createad @ {{ formatDate(book.created_at) }}</p>

                    <p>Last Edited @ {{ formatDate(book.updated_at) }}</p>
                  </div>
                </div>
                <RouterLink class="after:absolute after:inset-0" :to="`/book/${book.id}`" />
              </div>
            </div>
          </div>
          <!--Book List-->
        </div>

        <div class="p-4 col-span-2">
          <!-- Comment box -->
          <div v-if="user" class="mt-6">
            <!-- Muestra el estado de respuesta -->
            <div v-if="replyTo" class="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800">
              Replying to: {{ replyTo.name }}
              <button @click="replyTo = null" class="ml-2 text-red-500">Cancel</button>
            </div>

            <div class="bg-glass p-4 rounded-lg">
              <textarea v-model="newComment" placeholder="Join the discussion..."
                class="w-full p-2 border rounded-lg bg-slate-950 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"></textarea>
              <button @click="addComment"
                class="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600">
                Add comment
              </button>
              <ErrorMessage type="error" :message="commentError" />
            </div>
          </div>

          <div v-else>
            <RouterLink class="text-yellow-500 text-center mx-auto" to="/login">Log in to leave a comment
            </RouterLink>
          </div>
          <!-- Comment box -->
          <!-- Comments -->
          <div v-if="profileUser.id" class="comment-section rounded-lg shadow-md">
            <h2 class="text-lg font-semibold my-4">Profile comments</h2>

            <div v-for="comment in comments" :key="comment.id" class="mb-4 bg-glass p-4 rounded-lg">
              <CommentBox :comment="comment" />
            </div>
          </div>
          <!-- Comments -->
        </div>
      </div>
    </div>
  </div>
</template>
