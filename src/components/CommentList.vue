<script setup>
import { watch } from 'vue'

const props = defineProps(['comment'])
watch(
  () => props.comment,
  (newComment, oldComment) => {
    console.log('Comment changed from:', oldComment, 'to:', newComment)
  },
  { deep: true } // This makes sure Vue watches nested changes in the `comment` object
)
</script>
<template>
  <div>
    <div class="flex items-start space-x-4">
      <img :src="comment.avatar" alt="User avatar" class="h-[75px] rounded-full mr-2" />
      <div class="flex-1">
        <div class="flex justify-between items-center relative">
          <div>
            <h3 class="font-semibold text-yellow-500">{{ comment.name }}</h3>
            <p class="text-xs text-gray-400">{{ comment.created_at }} ago</p>
          </div>
          <a :href="`/${comment.name}#user-profile`" class="after:absolute after:inset-0" />
        </div>
        <p class="text-gray-200 mt-2">{{ comment.body }}</p>
      </div>
    </div>
  </div>
</template>
