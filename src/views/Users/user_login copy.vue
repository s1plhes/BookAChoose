<template>
    <section class="grid grid-cols-2 space-x-8 min-h-screen">
        <!-- Background Image -->
        <div class="w-full max-w-screen-md p-8 justify-self-center">
            <Logo class="mx-auto" colour="#FEFFFA" width="300px" />
            <div class="text-slate-100">Share with us</div>
        </div>

        <!-- Login Form -->
        <div class="">
            <div class="w-full max-w-md space-y-6">
                <h1 class="text-2xl font-bold text-slate-200 mt-12">Log in to your account</h1>
                <form class="space-y-4" @submit.prevent="login">
                    <!-- Email Field -->
                    <div>
                        <label for="email" class="block text-slate-200 font-semibold">Email Address</label>
                        <input type="email" id="email" v-model="email" placeholder="Enter Email Address" class="input"
                            autofocus autocomplete="on" required />
                    </div>

                    <!-- Password Field -->
                    <div>
                        <label for="password" class="block text-slate-200 font-semibold">Password</label>
                        <input type="password" id="password" v-model="password" placeholder="Enter Password"
                            minlength="8" autocomplete="on" class="input" required />
                    </div>

                    <!-- Forgot Password Link -->
                    <div class="text-right">
                        <a href="#"
                            class="text-sm font-semibold text-slate-200 hover:text-yellow-700 focus:text-yellow-700">Forgot
                            Password?</a>
                    </div>

                    <!-- Submit Button -->

                    <Btn class="w-full" variant="primary">Sign in</Btn>
                </form>

                <!-- Separator -->
                <hr class="my-6 border-gray-300" />

                <!-- Google Login Button -->
                <button type="button"
                    class="w-full bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300 flex items-center justify-center transition duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-6 h-6"
                        viewBox="0 0 48 48">
                        <defs>
                            <path id="a"
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                        </defs>
                        <clipPath id="b">
                            <use xlink:href="#a" overflow="visible" />
                        </clipPath>
                        <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                        <path clip-path="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                        <path clip-path="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                        <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                    </svg>

                    <span class="ml-4">Log in with Google</span>
                </button>

                <!-- Sign-Up Link -->
                <p class="mt-8 text-center text-slate-200">
                    Need an account? <a href="/register"
                        class="text-yellow-500 hover:text-yellow-700 font-semibold">Create
                        an
                        account</a>
                </p>

                <!-- Error and Success Messages -->
                <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
                <p v-if="successMessage" class="text-green-500 text-center">{{ successMessage }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const user = ref(null);
const loading = ref(false);

const login = async () => {
    loading.value = true;
    try {
        // Make the API call to the login endpoint with the email and password.
        const response = await axios.post('http://localhost:3000/api/login', {
            email: email.value,
            password: password.value,
        });

        // If the call is successful, store the token in local storage.
        successMessage.value = 'Login successful!';
        errorMessage.value = '';

        const token = response.data.token;
        //storage token and set 24 hours expiration
        localStorage.setItem('token', token);
        const now = new Date();
        const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        document.cookie = `token=${token}; expires=${expiration.toUTCString()}; path=/`;

        // Decode the JWT token to get the user data.

        // Fetch the user data using the token.
        await fetchUserData(token);

        // If the user data is returned, store it in the user variable.
        if (response.data?.user) {
            user.value = response.data;
        } else {
            console.error('User data not found in response');
        }

        // Reset the form.
        resetForm();

        // Redirect the user to the books page.
        window.location.href = '/books';
    } catch (error) {
        // If there is an error, display the error message.
        errorMessage.value = error.response?.data?.error || 'Login failed';
        successMessage.value = '';
    } finally {
        // Set the loading state to false, regardless of whether there was an error or not.
        loading.value = false;
    }
};

const fetchUserData = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        user.value = response.data;
    } catch (error) {
        errorMessage.value = 'Failed to fetch user data';
        console.error('Failed to fetch user data', error);
    }
};

const resetForm = () => {
    email.value = '';
    password.value = '';
};

onMounted(() => {
    const passwordInput = document.getElementById('password');
    const tooltip = document.getElementById('password-tooltip');

    passwordInput?.addEventListener('input', () => {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        tooltip.style.display = !regex.test(passwordInput.value) ? 'block' : 'none';
    });
});
</script>

<style scoped>
/* Optional: Add any custom styling here if needed */
</style>