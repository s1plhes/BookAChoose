<template>
  <main>
    <div class="user-list">
      <h2>User List</h2>
      <table v-if="users.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.lvl }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No users found.</p>
    </div>
    <a class="btn" href="/create-user">Create New User</a>
  </main>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Reactive variable to hold the list of users
const users = ref([])

// Function to fetch the list of users from the API
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// Fetch the users when the component is mounted
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.user-list h2 {
  text-align: center;
  margin-bottom: 20px;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
}

.user-list th,
.user-list td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.user-list th {
  background-color: #f8f9fa;
}
</style>
