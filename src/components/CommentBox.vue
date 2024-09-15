<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import Comment from './CommentList.vue'
import { useRoute } from 'vue-router'
import { user } from '@/mixins/authMixin'
import { toast } from 'vue3-toastify'
import router from '@/router'

const route = useRoute()
const comments = ref([])
const newComment = ref('')
const replyTo = ref(null)
const bookId = route.params.bookId
const chapterId = route.params.chapterId
const commentError = ref('')
// Cargar comentarios cuando el componente se monta
onMounted(async () => {
  await loadComments()
})

// Cargar comentarios de la API
const loadComments = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/comments/${bookId}/${chapterId}`)
    comments.value = buildCommentTree(response.data)
  } catch (error) {
    console.error('Error loading comments:', error)
  }
}

// Función recursiva para construir el árbol de comentarios
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

// Agregar un nuevo comentario o respuesta
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/comment`,
        {
          userId: user.value.userId,
          bookId,
          chapterId,
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
        const parentComment = findCommentById(comments.value, replyTo.value.id)
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = []
          parentComment.replies.push(newAddedComment)
        }
      } else {
        comments.value.push(newAddedComment) // Añadir comentario al nivel superior
      }

      comments.value = [...comments.value]
      //Trying to render again comments

      newComment.value = ''
      replyTo.value = null

      toast.success('Comment added!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
        theme: 'dark'
      })
      setTimeout(function () {
        router.go(0)
      }, 3000)
    } catch (error) {
      commentError.value = 'Error: ' + error
      console.error('Error adding comment:', error)
    }
  }
}

// Manejar la respuesta a un comentario
const setReply = (comment) => {
  replyTo.value = comment
}

// Función para encontrar un comentario por su ID
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
</script>

<template>
  <div class="comment-section p-4 font-sans">
    <div v-if="user" class="mt-6">
      <div v-if="replyTo" class="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800">
        Replying to: {{ replyTo.name }}
        <button @click="replyTo = null" class="ml-2 text-red-500">Cancel</button>
      </div>
      <div class="mb-4 bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg">
        <textarea
          v-model="newComment"
          placeholder="Join the discussion..."
          class="w-full p-2 border rounded-lg bg-slate-950 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
        <button
          @click="addComment"
          class="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Add comment
        </button>
        <ErrorMessage type="error" :message="commentError" />
      </div>
    </div>

    <h2 class="text-lg font-semibold mb-4">Member discussion</h2>
    <h2 v-if="!user" class="text-md text-center font-semibold">
      <RouterLink to="/login" class="text-yellow-500 italic">Sign in</RouterLink> and comment
    </h2>
    <h2 v-if="comments.length === 0" class="text-md">
      There are no comments yet
      <p v-if="user">or you can start one</p>
      <p v-else>
        Register to be the first to comment <br />
        <Btn class="text-black" variant="yellow" href="/register">Register </Btn>
      </p>
    </h2>

    <div
      v-for="comment in comments"
      :key="comment.id"
      class="mb-4 bg-glass hover:bg-neutral-950/30 p-4 rounded-lg"
    >
      <Comment :comment="comment" @reply="setReply" />
    </div>
  </div>
</template>
