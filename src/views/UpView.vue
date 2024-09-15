<template>
  <div class="bg-glass text-white text-center flex justify-center items-center">

    <div class="grid grid-cols-2">
      <div> <input type="file" @change="onFileChange" />
        <button @click="uploadFile">Upload</button>
      </div>
      <div class="flex justify-center items-center">
        <div v-if="imageUrl">
          <h3>Uploaded Image:</h3>
          <img class="h-[25veh]" :src="imageUrl" alt="Uploaded File" />
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import uploadService from '@/services/uploadService';


export default {
  data() {
    return {
      selectedFile: null,
      imageUrl: null, // URL of the uploaded image
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      try {
        this.imageUrl = await uploadService.uploadFile(this.selectedFile);
      } catch (error) {
        console.error('File upload error:', error);
      }
    },
  },
};
</script>
