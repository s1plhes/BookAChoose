<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import CommentBox from './pComment.vue'
import { useRoute } from 'vue-router'
import { user } from '../../mixins/authMixin'

const userId = user.value.userId
const route = useRoute()
const comments = ref([])
const newComment = ref('')
const replyTo = ref(null)

// Para almacenar el comentario al que se está respondiendo

const userName = route.params.username // Deberás obtener esto dinámicamente en tu aplicación

// Carga los comentarios al montar el componente
onMounted(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/comments/p/${userName}`)
    comments.value = buildCommentTree(response.data)
    console.log('Executed query with profile_id:', user.id)
  } catch (error) {
    console.error('Error loading comments:', error)
  }
})

// Función recursiva para construir la estructura de comentarios anidados
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
        'http://localhost:3000/api/comment/p',
        {
          userId: userId, // Obtenido del mixin o cookies
          profileName: userName, // Nombre de usuario de destino
          body: newComment.value.trim(),
          parent_id: replyTo.value ? replyTo.value.id : null // Para respuestas a comentarios
        },
        {
          headers: {
            Authorization: `${Cookies.get('accessToken')}`
          }
        }
      )

      const newAddedComment = response.data.comment

      // Manejo del nuevo comentario
      if (replyTo.value) {
        const parentComment = findCommentById(comments.value, replyTo.value.id)
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = []
          parentComment.replies.push(newAddedComment)
        }
      } else {
        comments.value.push(newAddedComment)
      }

      // Limpiar inputs después de añadir comentario
      newComment.value = ''
      replyTo.value = null
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }
}

// Manejar la respuesta a un comentario
const setReply = (comment) => {
  replyTo.value = comment
}

// Función recursiva para encontrar un comentario por su ID
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
  <div class="comment-section p-4 bg-glass shadow-md">
    <h2 class="text-lg font-semibold mb-4">Profile comdasdasdasments</h2>

    <div v-for="comment in comments" :key="comment.id" class="mb-4">
      <CommentBox :comment="comment" @reply="setReply" />
    </div>

    <div class="mt-6">
      <!-- Muestra el estado de respuesta -->
      <div v-if="replyTo" class="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800">
        Replying to: {{ replyTo.name }}
        <button @click="replyTo = null" class="ml-2 text-red-500">Cancel</button>
      </div>

      <textarea
        v-model="newComment"
        placeholder="Join the discussion..."
        class="w-full p-2 border rounded-lg bg-slate-950 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      >
      </textarea>

      <button
        @click="addComment"
        class="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
      >
        Add comment
      </button>
    </div>
  </div>
</template>
