<template>
    <div class="comment-section p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Member discussion</h2>

        <div v-for="comment in comments" :key="comment.id" class="mb-4">
            <div class="flex items-start space-x-4">
                <img :src="comment.avatar" alt="User avatar" class="w-10 h-10 rounded-full">
                <div class="flex-1">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-semibold text-gray-800">{{ comment.name }}</h3>
                            <p class="text-sm text-gray-500">{{ comment.title }} · {{ comment.timeAgo }} ago</p>
                        </div>
                        <button @click="likeComment(comment.id)"
                            class="text-gray-500 hover:text-gray-800 flex items-center">
                            <span v-if="comment.likes > 0" class="mr-1">{{ comment.likes }}</span>
                            ❤️
                        </button>
                    </div>
                    <p class="text-gray-700 mt-2">{{ comment.message }}</p>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <textarea v-model="newComment" placeholder="Join the discussion..."
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"></textarea>
            <button @click="addComment" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Add
                comment</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const comments = ref([
    {
        id: 1,
        name: 'Darlene Peterson',
        title: 'Business owner @ Coffee & Code',
        avatar: 'https://via.placeholder.com/40',
        message: 'Really enjoyed this issue. Feeling inspired by the article about publishing 100 articles in 100 days 🔥',
        timeAgo: '12 minutes',
        likes: 0,
    },
    {
        id: 2,
        name: 'Lucas Scott',
        title: 'Full-time parent',
        avatar: 'https://via.placeholder.com/40',
        message: 'Me too! I was thinking of trying it out with my new newsletter.',
        timeAgo: '9 minutes',
        likes: 1,
    },
    {
        id: 3,
        name: 'Quinn Hagen',
        title: 'Founder @ Acme Inc',
        avatar: 'https://via.placeholder.com/40',
        message: 'Has anyone here taken the newsletter course mentioned in this issue? My team is thinking of trying it out.',
        timeAgo: '4 minutes',
        likes: 0,
    },
]);

const newComment = ref('');

const addComment = () => {
    if (newComment.value.trim()) {
        comments.value.push({
            id: Date.now(),
            name: 'John Doe',  // Nombre de usuario ficticio para ejemplo
            title: 'Member',  // Título ficticio para ejemplo
            avatar: 'https://via.placeholder.com/40',
            message: newComment.value.trim(),
            timeAgo: 'Just now',
            likes: 0,
        });
        newComment.value = '';
    }
};

const likeComment = (id) => {
    const comment = comments.value.find(c => c.id === id);
    if (comment) {
        comment.likes += 1;
    }
};
</script>

<style scoped>
.comment-section {
    max-width: 600px;
    margin: 0 auto;
}
</style>