<template>

  <Head>
    <title>{{ profileUser.name }} on {{ SITE_NAME }}</title>
  </Head>
  <div v-if="error" class="text-yellow-500 text-3xl">{{ error }}</div>
  <div class="min-h-screen text-white">
    <div class="container mx-auto">
      <!-- User Information Section -->
      <!--  H E A D E R  -->x
      <div class="bg-yellow-500 text-center w-full p-6 h-[200px]">header</div>
      <!--  H E A D E R  -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="block mx-auto pb-4 w-full bg-slate-900/30 backdrop-blur-sm">
          <!-- User Avatar -->
          <div class="flex justify-center">
            <img :src="profileUser.avatar || 'default-avatar.png'" alt="User Avatar"
              class="h-48 w-48 rounded-full border-4 border-white object-cover -translate-y-8" />
          </div>
          <!-- User Details -->
          <div class="text-center mt-6">
            <h1 class="text-3xl font-bold">{{ profileUser.name || "USER.NAME" }}</h1>
            <div class="flex justify-center space-x-6 mt-4">
              <div class="text-sm">
                <p class="font-semibold">Books</p>
                <p>{{ profileUser.bookCount || 0 }}</p>
              </div>
              <div class="text-sm">
                <p class="font-semibold">Followers</p>
                <p>{{ profileUser.followersCount || 0 }}</p>
              </div>
              d
            </div>
          </div>
        </div>

        <div class="p-4">
          <!-- Comment box -->
          <div v-if="user" class="mt-6">
            <!-- Muestra el estado de respuesta -->
            <div v-if="replyTo" class="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800">
              Replying to: {{ replyTo.name }}
              <button @click="replyTo = null" class="ml-2 text-red-500">Cancel</button>
            </div>

            <div class="bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg">
              <textarea v-model="newComment" placeholder="Join the discussion..."
                class="w-full p-2 border rounded-lg bg-slate-950 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"></textarea>
              <button @click="addComment"
                class="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600">
                Add comment
              </button>
            </div>
          </div>
          <div v-else>
            <RouterLink class="text-yellow-500 text-center mx-auto" to="/login">Log in to leave a comment
            </RouterLink>
          </div>
          <!-- Comment box -->
          <!-- Comments -->
          <div v-if="profileUser.id" class="comment-section p-4 rounded-lg shadow-md">
            <h2 class="text-lg font-semibold mb-4">Profile comments</h2>
            <div v-for="comment in comments" :key="comment.id"
              class="mb-4 bg-slate-900/30 backdrop-blur-sm p-4 rounded-lg">
              <CommentBox :comment="comment" @reply="setReply" />
            </div>
          </div>
          <!-- Comments -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { user } from "@/mixins/authMixin";
import { useRoute } from "vue-router";
import CommentBox from "@/components/profile/pComment.vue";
import axios from "axios";
import { Head } from "@unhead/vue/components";

const route = useRoute();
const profileUser = ref("");
const profileUserName = route.params.username;
const pid = ref("");
const comments = ref([]);
const newComment = ref("");
const replyTo = ref(null);
const API_URL = import.meta.env.VITE_APP_API;


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

// Manejar la respuesta a un comentario
const setReply = (comment) => {
  replyTo.value = comment;
};

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

// Agregar un nuevo comentario o respuesta
const addComment = async () => {
  if (newComment.value.trim()) {
    try {
      const response = await axios.post(
        `${API_URL}/comment/p`,
        {
          userId: userId, // Obtenido del mixin o cookies
          profileName: userName, // Nombre de usuario de destino
          body: newComment.value.trim(),
          parent_id: replyTo.value ? replyTo.value.id : null, // Para respuestas a comentarios
        },
        {
          headers: {
            Authorization: `${Cookies.get("accessToken")}`,
          },
        }
      );

      const newAddedComment = response.data.comment;

      // Manejo del nuevo comentario
      if (replyTo.value) {
        const parentComment = findCommentById(comments.value, replyTo.value.id);
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = [];
          parentComment.replies.push(newAddedComment);
        }
      } else {
        comments.value.push(newAddedComment);
      }

      // Limpiar inputs después de añadir comentario
      newComment.value = "";
      replyTo.value = null;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
};

onMounted(async () => {
  //Let's gather user data
  try {
    const response = await fetch(`${API_URL}/${profileUserName}/data`);
    const data = await response.json();
    profileUser.value = data;
    //setting pid
    pid.value = profileUser.value.id;
  } catch (error) {
    console.error(error);
  }

  if (pid) {
    try {
      const response = await axios.get(
        `${API_URL}/profile/comments/${pid.value}`
      );
      comments.value = buildCommentTree(response.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  } else {
    console.log("Error: no id provided.");
  }
});
</script>
