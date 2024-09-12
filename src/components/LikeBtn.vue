<template>
  <div class="py-2">
    <p v-if="likeData.liked === true" class="text-white flex items-center">
      <button v-tooltip="'Unlike'" class="text-red-500 hover:text-red-500" @click="handleDelLike">
        <i class="fa fa-heart text-red-500 text-xl"></i>
      </button>
    </p>
    <p v-else>
      <button v-tooltip="'Like'" class="text-gray-400 hover:text-red-400" @click="handleLike">
        <i class="fa fa-heart text-gray-400 text-xl"></i>
      </button>
    </p>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const props = defineProps({
  userId: String,
  bookId: String,
  chapterId: String
})

// Obtener la instancia actual de Vue
const { proxy } = getCurrentInstance()

// Acceder al sistema de likes a través de la instancia de Vue
const likeData = proxy.$likeSystem.likeData

const handleLike = () => {
  toast.success('Like added!', {
    autoClose: 300,
    onClose: () => {
      proxy.$likeSystem.Like(props.userId, props.bookId, props.chapterId)
      proxy.$likeSystem.fetchLike(props.userId, props.bookId, props.chapterId)
      router.go(0)
    }
  })
}

const handleDelLike = () => {
  toast.success('Like removed!', {
    autoClose: 300,
    onClose: () => {
      proxy.$likeSystem.DelLike(props.userId, props.bookId, props.chapterId)
      proxy.$likeSystem.fetchLike(props.userId, props.bookId, props.chapterId)
      router.go(0)
    }
  })
}

// Opcional: Llamar fetchLike para inicializar los datos si es necesario
proxy.$likeSystem.fetchLike(props.userId, props.bookId, props.chapterId)
</script>
