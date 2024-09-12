<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadFile">Upload File</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const message = ref('')

function handleFileUpload(event) {
  selectedFile.value = event.target.files[0]
}

async function uploadFile() {
  if (!selectedFile.value) {
    message.value = 'Please select a file first'
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch(`${import.meta.env.VITE_API}/upload`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      message.value = 'File uploaded successfully: ' + result.url
    } else {
      message.value = 'File upload failed: ' + result.message
    }
  } catch (error) {
    message.value = 'An error occurred: ' + error.message
  }
}
</script>
