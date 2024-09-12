<script setup>
import { formatDate } from '@/plugins/formatDate'
import PComment from './pComment.vue'

const props = defineProps(['comment'])
</script>

<template>
  <div>
    <div class="flex items-start space-x-4">
      <img :src="props.comment.avatar" alt="User avatar" class="w-10 h-10 rounded-full mr-1" />
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold text-yellow-500">
              <RouterLink :to="`/${props.comment.name}`">{{ props.comment.name }}</RouterLink>
            </h3>
            <p class="text-sm text-gray-500">{{ formatDate(props.comment.created_at) }} ago</p>
          </div>
        </div>
        <p class="text-slate-200 mt-2">{{ props.comment.body }}</p>
      </div>
    </div>

    <!-- Mostrar respuestas -->
    <div v-if="props.comment.replies && props.comment.replies.length" class="ml-12 mt-4">
      <PComment v-for="reply in props.comment.replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>
