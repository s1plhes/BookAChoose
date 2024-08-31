<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import Comment from "./Comment.vue";
import { useRoute } from "vue-router";
import { user } from "@/mixins/authMixin";

const route = useRoute();
const comments = ref([]);
const newComment = ref("");
const replyTo = ref(null); // Para almacenar el comentario al que se está respondiendo
const API_URL = import.meta.env.VITE_APP_API;
const bookId = route.params.bookId; // Deberás obtener esto dinámicamente en tu aplicación
const chapterId = route.params.chapterId; // Deberás obtener esto dinámicamente en tu aplicación

// Carga los comentarios al montar el componente
onMounted(async () => {
  try {
    const response = await axios.get(
      `${process.env.API}/comments/${bookId}/${chapterId}`
    );
    comments.value = buildCommentTree(response.data);
  } catch (error) {
    console.error("Error loading comments:", error);
  }
});

// Función recursiva para construir la estructura de comentarios anidados
function buildCommentTree(comments, parentId = null) {
  const tree = [];
  for (const comment of comments) {
    if (comment.parent_id === parentId) {
      const children = buildCommentTree(comments, comment.id);
      if (children.length) {
        comment.replies = children;
      }
      tree.push(comment);
    }
  }
  return tree;
}

// Agregar un nuevo comentario o respuesta
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      const response = await axios.post(
        `${process.env.API}/comment`,
        {
          userId: userId, // Asegúrate de que userId esté almacenado en Cookies
          bookId,
          chapterId,
          body: newComment.value.trim(),
          parent_id: replyTo.value ? replyTo.value.id : null,
        },
        {
          headers: {
            Authorization: `${Cookies.get("accessToken")}`,
          },
        }
      );

      const newAddedComment = response.data.comment;

      if (replyTo.value) {
        // Añadir la respuesta al comentario padre
        const parentComment = findCommentById(comments.value, replyTo.value.id);
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = [];
          parentComment.replies.push(newAddedComment);
        }
      } else {
        // Añadir comentario al nivel superior
        comments.value.push(newAddedComment);
      }

      newComment.value = "";
      replyTo.value = null; // Reinicia el estado de respuesta
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
};

// Manejar la respuesta a un comentario
const setReply = (comment) => {
  replyTo.value = comment;
};

// Función recursiva para encontrar un comentario por su ID
function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    const found = findCommentById(comment.replies || [], id);
    if (found) {
      return found;
    }
  }
  return null;
}
</script>

<template>
  <div class="comment-section p-4">
    <div v-if="user" class="mt-6">
      <!-- Muestra el estado de respuesta -->
      <div v-if="replyTo" class="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800">
        Replying to: {{ replyTo.name }}
        <button @click="replyTo = null" class="ml-2 text-red-500">Cancel</button>
      </div>
      <div class="mb-4 bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg">
        <textarea v-model="newComment" placeholder="Join the discussion..."
          class="w-full p-2 border rounded-lg bg-slate-950 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"></textarea>
        <button @click="addComment" class="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600">
          Add comment
        </button>
      </div>
    </div>
    <h2 class="text-lg font-semibold mb-4">Member discussion</h2>

    <div v-for="comment in comments" :key="comment.id" class="mb-4 bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg">
      <Comment :comment="comment" @reply="setReply" />
    </div>
  </div>
</template>
