<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Cookies from "js-cookie";
// Define reactive variables for form data
const name = ref('')
const password = ref('')
const email = ref('')
const lvl = ref('')
const message = ref('')
const API_URL = import.meta.env.VITE_APP_API;
// Function to handle form submission
const submitForm = async () => {
  const token = Cookies.get('accessToken');
  try {
    const response = await axios.post(`${process.env.API}/users/create`, {
      name: name.value,
      password: password.value,
      email: email.value,
      lvl: lvl.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`  // Include the token in the Authorization header
      }
    })

    // Show success message
    message.value = `User created successfully with ID: ${response.data.id}`

    // Clear the form
    name.value = ''
    password.value = ''
    email.value = ''
    lvl.value = ''
  } catch (error) {
    // Handle error and show message
    message.value = `Error: ${error.response.data.error || error.message}`
  }
}
</script>

<template>
  <div class="user-form">
    <h2>Create New User</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="lvl">Level:</label>
        <input type="number" v-model="lvl" id="lvl" required />
      </div>
      <button class="btn" type="submit">Create User</button>
    </form>

    <div v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>


<style scoped></style>
