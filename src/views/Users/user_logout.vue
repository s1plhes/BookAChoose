<script setup>
import { user } from '@/mixins/authMixin';
import { checkAuth } from '@/plugins/checkAuth';
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';

const message = ref('');
const error = ref('');


const logout = async () => {
    try {
        const token = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        const response = await axios.post('http://localhost:3000/api/logout', { refreshToken }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        );
        if (response.status === 200) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            localStorage.clear();

            message.value = 'You have been logged out successfully!';
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } else {
            error.value = response.data.message || 'Unknown error';
        }
    } catch (err) {
        console.error('Logout error:', err);
        error.value = err.response?.data?.message || 'Logout failed :(';
    }
};


onMounted(() => {
    logout();
    onMounted(() => {
        checkAuth(user);
    });
});
</script>

<template>
    <div class="logout-container">
        <h1 class="text-2xl font-bold text-slate-200 mt-12">Logout Process</h1>
        <p v-if="message" class="text-green-500">{{ message }}</p>
        <p v-if="error" class="text-red-500">Logout failed: {{ error }}</p>
    </div>
</template>


<style scoped>
.logout-container {
    color: white;
    text-align: center;
    margin-top: 50px;
}
</style>