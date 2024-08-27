<script setup>
const props = defineProps(['comment']);
const emit = defineEmits(['reply']);

function handleReply() {
    emit('reply', props.comment);
}
</script>

<template>
    <div>
        <div class="flex items-start space-x-4">
            <img :src="comment.avatar" alt="User avatar" class="w-8 h-8 rounded-full mr-2">
            <div class="flex-1">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold text-yellow-500">{{ comment.name }}</h3>
                        <p class="text-sm text-gray-500">{{ comment.created_at }} ago</p>
                    </div>
                </div>
                <p class="text-gray-700 mt-2">{{ comment.body }}</p>
                <button @click="$emit('reply', comment.id)"
                    class="text-sm text-yellow-300 hover:underline mt-2">Reply</button>
            </div>
        </div>

        <!-- Mostrar respuestas -->
        <div v-if="comment.replies && comment.replies.length" class="ml-12 mt-4">
            <Comment v-for="reply in comment.replies" :key="reply.id" :comment="reply" @reply="$emit('reply')" />
        </div>
    </div>
</template>
