<script setup>
const props = defineProps({
    book: {
        type: Object,
        required: true,
        default: () => ({
            title: "",
            author: "",
            description: "",
            id: 0,
        }),
    },
    style: {
        type: String,
        default: "",
    },
});

const { title, author, description, id } = props.book;
</script>

<template>
    <article
        class="relative p-4 rounded-lg shadow-lg space-y-4 max-w-lg mx-auto bg-center bg-no-repeat bg-cover min-h-48"
        :style="`background: linear-gradient(rgba(2, 6, 23, -0.15), rgba(0, 0, 0, 5.9)), url(${style}); background-size: cover; min-height: 35.5vmin;`">
        <div class="">

            <div class="space-y-2  bg-slate-900/30 backdrop-blur-md rounded-md p-2 text-slate-100">
                <h1 class="text-2xl font-bold font-mono line-clamp-2 leading-tight tracking-wide">
                    {{ title }}
                </h1>
                <p class="font-mono">
                    <a :href="`/${author}`" class="hover:underline">
                        by {{ author }}
                    </a>
                </p>
                <div class="hover:visible text-white text-sm line-clamp-5 leading-relaxed">
                    <p>{{ description }}</p>
                </div>
            </div>
            <footer class="absolute inset-x-0 bottom-0 flex justify-center mt-6">
                <Btn variant="yellow" :href="`/book/${id}`" class="px-6 py-2 my-3 text-lg rounded-full">
                    Read this book
                </Btn>
            </footer>
        </div>
    </article>
</template>

<style scoped>
.line-clamp-5 {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
