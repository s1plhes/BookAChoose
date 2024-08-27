<template>
    <div class="min-h-screen text-white">
        <div class="container mx-auto py-10">
            <!-- User Information Section -->
            <div class="bg-black/50 text-center w-full p-6"
                style="background: url('https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'); background-size: cover;">
                header
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="block mx-auto p-4 bg-slate-500/30">
                    <!-- User Avatar -->
                    <div class="flex justify-center">
                        <img :src="profileUser.avatar || 'default-avatar.png'" alt="User Avatar"
                            class="h-48 w-48 rounded-full border-4 border-white object-cover" />
                    </div>
                    <!-- User Details -->
                    <div class="text-center mt-6">
                        <h1 class="text-3xl font-bold">{{ profileUser.name || 'USER.NAME' }}</h1>
                        <div class="flex justify-center space-x-6 mt-4">
                            <div class="text-sm">
                                <p class="font-semibold">Books</p>
                                <p>{{ user.bookCount || 0 }}</p>
                            </div>
                            <div class="text-sm">
                                <p class="font-semibold">Followers</p>
                                <p>{{ user.followersCount || 0 }}</p>
                            </div>d
                        </div>
                    </div>
                </div>

                <div class="p-4">
                    {{ profileUser.id }}
                    <ProfileComments v-if="profileUser.id" :pid="profileUser.id" />
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { user } from '@/mixins/authMixin';
import { useRoute } from 'vue-router';
import ProfileComments from '@/components/profile/pComments.vue';
const route = useRoute()
const profileUser = ref('')
const profileUserName = route.params.username



onMounted(async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/${profileUserName}/data`);
        const data = await response.json();
        profileUser.value = data;
        //setting pid
    } catch (error) {
        console.error(error);

    }

});
</script>
