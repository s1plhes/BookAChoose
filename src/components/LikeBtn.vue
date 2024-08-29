<template>
    <div class="py-2">
        <p v-if="likeData.liked === true" class="text-white flex items-center">
            <button class="text-red-500 hover:text-red-500" @click="handleDelLike">You love this <i
                    class="fa fa-heart text-red-500 "></i></button>
        </p>
        <p v-else>
            <button class="text-gray-400 hover:text-red-400" @click="handleLike">I love this <i
                    class="fa fa-heart text-gray-400"></i></button>
        </p>
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    userId: String,
    bookId: String,
    chapterId: String
});

// Obtener la instancia actual de Vue
const { proxy } = getCurrentInstance();

// Acceder al sistema de likes a través de la instancia de Vue
const likeData = proxy.$likeSystem.likeData;

const handleLike = () => {
    proxy.$likeSystem.Like(props.userId, props.bookId, props.chapterId);
    router.go(0)
}

const handleDelLike = () => {
    proxy.$likeSystem.DelLike(props.userId, props.bookId, props.chapterId);
    router.go(0)
}

// Opcional: Llamar fetchLike para inicializar los datos si es necesario
proxy.$likeSystem.fetchLike(props.userId, props.bookId, props.chapterId);
</script>
