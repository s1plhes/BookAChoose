// src/plugins/LikeSystem.js
import axios from 'axios';
import { ref } from 'vue';
import { user } from '@/mixins/authMixin';
import Cookies from 'js-cookie';

const token = Cookies.get('accessToken');
const API_URL = import.meta.env.VITE_APP_API;

export default {
    install: (app) => {
        const likeData = ref({ liked: false });

        const fetchLike = async (userId, bookId, chapterId) => {

            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`, {
                    headers: {
                        Authorization: `${token}`  // Include the token in the Authorization header
                    }
                });
                likeData.value.liked = data.liked;
                console.log("Like data fetched:", likeData.value.liked);
            } catch (error) {
                console.error("Error fetching like:", error);
            }
        };

        const Like = async (userId, bookId, chapterId) => {
            const token = Cookies.get('accessToken');
            if (!token) {
                message.value = 'Authorization token is missing.';
                return;
            }

            try {
                await axios.post(`${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                );
                likeData.value.liked = true;
                console.log("Book liked successfully");
            } catch (error) {
                console.error("Error liking book:", error);
            }
        };

        const DelLike = async (userId, bookId, chapterId) => {
            const token = Cookies.get('accessToken');
            if (!token) {
                message.value = 'Authorization token is missing.';
                return;
            }
            try {
                await axios.delete(`${import.meta.env.VITE_API}/like/${userId}/${bookId}/${chapterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                );
                likeData.value.liked = false;
            } catch (error) {
                console.error("Error deleting book's like:", error);
            }
        };

        // Expose the methods globally
        app.config.globalProperties.$likeSystem = {
            likeData,
            fetchLike,
            Like,
            DelLike
        };
    }
};
