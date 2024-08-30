<template>
    <div class="flex justify-center max-h-fit">
        <div class="p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-xl font-semibold text-center text-slate-100">
                Be part of this community
            </h2>
            <h2 class="text-2xl font-semibold text-center text-slate-100 mb-6">Sign Up</h2>
            <Separator />
            <form @submit.prevent="register">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-slate-100">Name</label>
                    <input type="text" id="name" v-model="name" required class="input" placeholder="Enter your name" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-slate-100">Email</label>
                    <input type="email" id="email" v-model="email" required class="input"
                        placeholder="Enter your email" />
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-slate-100">Password</label>
                    <input type="password" id="password" v-model="password" @input="validatePassword" required
                        class="input" placeholder="Enter your password" />
                    <div class="mt-2 text-sm">
                        <p class="text-slate-100">Your Password must contain:</p>
                        <p :class="{
                            'text-green-500': passwordLength,
                            'text-red-500': !passwordLength,
                        }">
                            8 characters
                        </p>
                        <p :class="{ 'text-green-500': hasUppercase, 'text-red-500': !hasUppercase }">
                            1 uppercase
                        </p>
                        <p :class="{ 'text-green-500': hasLowercase, 'text-red-500': !hasLowercase }">
                            1 lowercase
                        </p>
                        <p :class="{ 'text-green-500': hasNumber, 'text-red-500': !hasNumber }">
                            1 number
                        </p>
                        <p :class="{
                            'text-green-500': hasSpecialCharacter,
                            'text-red-500': !hasSpecialCharacter,
                        }">
                            1 special character
                        </p>
                    </div>
                </div>
                <div class="mb-4">
                    <label for="Confirm_password" class="block text-sm font-medium text-slate-100">Confirm
                        Password</label>
                    <input type="password" id="Confirm_password" v-model="Confirm_password" required class="input"
                        placeholder="Confirm your password" />
                </div>

                <Btn :disabled="!isFormValid" variant="primary" class="w-1/4"
                    :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }">Register</Btn>
            </form>
            <p v-if="errorMessage" class="mt-4 text-center text-sm text-red-600">
                {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="mt-4 text-center text-sm text-green-600">
                {{ successMessage }}
            </p>
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Already have an account?
                    <a href="/login" class="text-yellow-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

const name = ref("");
const email = ref("");
const password = ref("");
const Confirm_password = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const API_URL = import.meta.env.VITE_APP_API;
const passwordLength = computed(() => password.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasNumber = computed(() => /[0-9]/.test(password.value));
const hasSpecialCharacter = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(password.value));

const isFormValid = computed(
    () =>
        passwordLength.value &&
        hasUppercase.value &&
        hasLowercase.value &&
        hasNumber.value &&
        hasSpecialCharacter.value &&
        password.value === Confirm_password.value
);

const register = async () => {
    if (!isFormValid.value) return;
    const token = Cookies.get("accessToken");
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            {
                name: name.value,
                email: email.value,
                password: password.value,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );
        successMessage.value = response.data.message;
        errorMessage.value = "";
        // Redirection to login
        window.location.href = "/login";
    } catch (error) {
        errorMessage.value = error.response?.data?.error || "Registration failed";
        successMessage.value = "";
    }
};
</script>

<style scoped></style>
