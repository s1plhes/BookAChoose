<script setup>
defineProps({
    book: {
        title: String,
        author: String,
        description: String,
        id: Number
    },
    style: String
})
</script>

<template>
    <article class="p-6 rounded-lg shadow-lg space-y-4 max-w-md mx-auto bg-center bg-no-repeat bg-cover min-h-48"
        :style="`
        background: linear-gradient(rgba(2, 6, 23, 0.85), rgba(0, 0, 0, 0.9)), url('${style}');
        background-size: 100% 100% ;min-height: 35.5vmin;
    `">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold font-mono line-clamp-2 text-white leading-tight tracking-wide">
                {{ book.title }}
            </h1>
            <p class="text-gray-300 font-mono">
                <a :href="`/${book.author}`" class="hover:underline">
                    by {{ book.author }}{{ book.avatar }}
                </a>
            </p>
        </div>
        <div class="text-slate-100 text-sm line-clamp-5 leading-relaxed">
            <p>{{ book.description }}</p>
        </div>
        <footer class="flex justify-center mt-6">
            <Btn variant="primary" :href="`/book/${book.id}`" class="px-6 py-2 text-lg rounded-full">
                Read this book
            </Btn>
        </footer>
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
