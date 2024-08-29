<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { user } from '@/mixins/authMixin';
import Separator from '@/components/Separator.vue';
import { checkAuth } from '@/plugins/checkAuth';
import Cookies from 'js-cookie';

const name = ref('');
const email = ref('');
const avatar = ref('');
const current_password = ref('');
const new_password = ref('');
const confirm_password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const token = Cookies.get('accessToken');

const selectedFile = ref(null); // Variable reactiva para el archivo seleccionado
const message = ref('');

// Sanitiza la entrada
const sanitizeInput = (input) => {
    return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Obtiene los datos del usuario
const GetUserData = async () => {
    try {
        if (user && user.value && user.value.userId) {
            const response = await axios.get(`http://localhost:3000/api/users/${user.value.userId}`);
            if (response.status === 200) {
                name.value = sanitizeInput(response.data.name);
                email.value = sanitizeInput(response.data.email);
                avatar.value = sanitizeInput(response.data.avatar);
            }
        } else {
            errorMessage.value = 'User data not available';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to fetch user data';
    }
};

// Actualiza los datos del usuario
const UpdateUser = async () => {
    try {
        const sanitizedCurrentPassword = sanitizeInput(current_password.value);
        const sanitizedNewPassword = sanitizeInput(new_password.value);
        const sanitizedConfirmPassword = sanitizeInput(confirm_password.value);
        const sanitizedName = sanitizeInput(name.value);
        const sanitizedEmail = sanitizeInput(email.value);

        if (sanitizedNewPassword !== sanitizedConfirmPassword) {
            throw new Error('Passwords do not match');
        }

        let avatarUrl = avatar.value; // Mantén la URL actual del avatar

        if (selectedFile.value) {
            // Subir el nuevo avatar
            const uploadResult = await uploadFile(selectedFile.value);
            if (uploadResult) {
                avatarUrl = uploadResult; // Actualiza la URL del avatar
            } else {
                throw new Error('Avatar upload failed');
            }
        }

        const updateData = {
            name: sanitizedName,
            email: sanitizedEmail,
            avatar: avatarUrl,
            password: sanitizedCurrentPassword,
        };

        if (sanitizedNewPassword) {
            updateData.password = sanitizedNewPassword;
        }

        const response = await axios.put(`http://localhost:3000/api/users/${user.value.userId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },

        });

        if (response.status === 200) {
            Cookies.set('name', sanitizedName);
            Cookies.set('avatar', avatarUrl);
            successMessage.value = 'Profile updated successfully!';
            errorMessage.value = '';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.error || error.message || 'Failed to update profile';
        successMessage.value = '';
    }
};

// Función para subir el archivo
async function uploadFile(file) {
    if (!file) {
        message.value = 'Please select a file first';
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            return result.url;
        } else {
            message.value = 'File upload failed: ' + result.message;
            return null;
        }
    } catch (error) {
        message.value = 'An error occurred: ' + error.message;
        return null;
    }
}

// Maneja el archivo cargado
function handleFileUpload(event) {
    selectedFile.value = event.target.files[0];
}

onMounted(() => {
    if (user && user.value && user.value.userId) {
        GetUserData();
    } else {
        errorMessage.value = 'User is not authenticated';
    }
    checkAuth(user)
});
</script>


<template>

    <div class="px-6 max-w-2xl w-full mx-auto">
        <h1 class="text-2xl font-bold text-slate-100 mb-4">Account Settings</h1>
        <Separator />
        <form @submit.prevent="UpdateUser">
            <!-- Settings Section -->
            <div class="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-5 ">
                <div class="flex mx-auto
                            ">
                    <img id="userAvatar" :src="avatar" alt="user"
                        class="object-cover bg-yellow-500 border border-slate-800 h-48 w-48 rounded-md" />
                </div>
                <div>
                    <div class="mb-4">


                        <label for="file" class="text-white text-sm">Avatar

                            <input type="file" name="file" id="file" @change="handleFileUpload" class="text-sm text-grey-500
            file:mr-2 file:py-3 file:px-4
            file:rounded-lg file:border-0
            file:text-md file:font-semibold  file:text-black
            file:bg-yellow-500 
            hover:file:cursor-pointer hover:file:opacity-80
          " />
                        </label>
                    </div>
                    <div class="mb-4">
                        <label for="name" class="block text-xs font-medium text-slate-100">Name</label>
                        <input type="text" id="name" v-model="name" class="input" placeholder="Enter your name" />
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-xs font-medium text-slate-100">Email</label>
                        <input type="email" id="email" v-model="email" class="input" placeholder="Enter your email" />
                    </div>
                </div>
                <div>
                    <div class="mb-4">
                        <label for="current_password" class="block text-xs font-medium text-slate-100">Current
                            Password</label>
                        <input type="password" id="current_password" v-model="current_password" required class="input"
                            placeholder="Enter your current password" />
                    </div>
                    <div class="mb-4">
                        <label for="new_password" class="block text-xs font-medium text-slate-100">New
                            Password</label>
                        <input type="input" placeholder="Enter your new password" class="input" />
                    </div>
                    <div class="mb-4">
                        <label for="confirm_password" class="block text-xs font-medium text-slate-100">Confirm New
                            Password</label>
                        <input type="password" id="confirm_password" v-model="confirm_password" class="input"
                            placeholder="Confirm your password" />
                    </div>
                </div>
                <!-- Settings Section -->
            </div>
            <div class="flex justify-center items-center"> <button type="submit"
                    class=" w-1/4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition duration-150">
                    Save
                </button>
            </div>

        </form>
        <ErrorMessage :message="errorMessage" type="error" :autoClose="false" :autoCloseDelay="5000" />
        <SuccessMessage :message="successMessage" type="success" :autoClose="false" :autoCloseDelay="5000" />
    </div>


</template>
