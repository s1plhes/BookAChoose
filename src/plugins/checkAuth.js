
import { useRouter } from 'vue-router';

export const checkAuth = (user) => {
    const router = useRouter();
    if (!user.value) {
        router.push('/403');
    }
};
