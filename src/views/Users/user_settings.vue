<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { user } from '@/mixins/authMixin'
import { checkAuth } from '@/plugins/checkAuth'
import Cookies from 'js-cookie'
import { toast } from 'vue3-toastify'

const name = ref('')
const email = ref('')
const avatar = ref('')
const current_password = ref('')
const new_password = ref('')
const confirm_password = ref('')
const errorMessage = ref('')
const headerErrorMessage = ref('')
const successMessage = ref('')
const headerSuccessMessage = ref('')
const token = Cookies.get('accessToken')
const fontSize = ref(Cookies.get('fontSize') || 18)
const fontSizeInfo = ref('')
const selectedFile = ref(null) // Variable reactiva para el archivo seleccionado
const message = ref('')
const toggleURL = ref(false) // Para mostrar/ocultar campos
const headerImageUrl = ref('')
const imageURL = ref('')
const image = ref('')

const updateHeaderImage = async () => {
  const newHeaderImage = headerImageUrl.value

  if (!newHeaderImage) {
    return
  }

  try {
    const token = Cookies.get('accessToken')
    const sanitizedInput = sanitizeInput(newHeaderImage)
    if (sanitizedInput) {
      Cookies.set('headerImage', sanitizedInput, { expires: 365 })
      headerImageUrl.value = sanitizedInput
      const response = await axios.put(
        `${import.meta.env.VITE_API}/users/${user.value.userId}`,
        {
          header_image: sanitizedInput
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        headerSuccessMessage.value = 'Header image updated successfully'
      }
    }
  } catch (error) {
    headerErrorMessage.value = 'Header image update failed: ' + error
  }
}

const UpdateReadingSettings = async () => {
  try {
    const sanitizedInput = sanitizeInput(fontSize.value)
    if (sanitizedInput) {
      Cookies.set('fontSize', sanitizedInput, { expires: 365 })
      fontSize.value = sanitizedInput
      toast.success(`Font size set: ${fontSize.value}px`, {
        autoClose: false,
        position: toast.POSITION.TOP_CENTER
      })
    }
  } catch (error) {
    toast.error('Failed to update font size', {
      autoClose: false,
      position: toast.POSITION.TOP_CENTER
    })
  }
}

// Sanitiza la entrada
const sanitizeInput = (input) => {
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Obtiene los datos del usuario
const GetUserData = async () => {
  try {
    if (user && user.value && user.value.userId) {
      const response = await axios.get(`${import.meta.env.VITE_API}/users/${user.value.userId}`)
      if (response.status === 200) {
        name.value = sanitizeInput(response.data.name)
        email.value = sanitizeInput(response.data.email)
        imageSrc.value = sanitizeInput(response.data.avatar)
        avatar.value = sanitizeInput(response.data.avatar)
        headerImageUrl.value = sanitizeInput(response.data.header_image)
      }
    } else {
      errorMessage.value = 'User data not available'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Failed to fetch user data'
  }
}

// Actualiza los datos del usuario
const UpdateUser = async () => {
  try {
    const sanitizedCurrentPassword = sanitizeInput(current_password.value)
    const sanitizedNewPassword = sanitizeInput(new_password.value)
    const sanitizedConfirmPassword = sanitizeInput(confirm_password.value)
    const sanitizedName = sanitizeInput(name.value)
    const sanitizedEmail = sanitizeInput(email.value)

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      throw new Error('Passwords do not match')
    }

    let avatarUrl = toggleURL.value ? imageURL.value : image.value // Usa URL de la imagen o archivo

    if (!toggleURL.value && selectedFile.value) {
      // Subir el nuevo archivo si no se usa URL
      const uploadResult = await uploadFile(selectedFile.value)
      if (uploadResult) {
        avatarUrl = uploadResult // Actualiza la URL del archivo
      } else {
        throw new Error('File upload failed')
      }
    }

    const updateData = {
      name: sanitizedName,
      email: sanitizedEmail,
      avatar: avatarUrl,
      password: sanitizedCurrentPassword
    }

    if (sanitizedNewPassword) {
      updateData.password = sanitizedNewPassword
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API}/users/${user.value.userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.status === 200) {
      Cookies.set('name', sanitizedName)
      Cookies.set('avatar', avatarUrl)
      successMessage.value = 'Profile updated successfully!'
      errorMessage.value = ''
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message || 'Failed to update profile'
    successMessage.value = ''
  }
}

// Función para subir el archivo
async function uploadFile(file) {
  if (!file) {
    message.value = 'Please select a file first'
    return null
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${import.meta.env.VITE_API}/upload`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.success) {
      return result.url
    } else {
      message.value = 'File upload failed: ' + result.message
      return null
    }
  } catch (error) {
    message.value = 'An error occurred: ' + error.message
    return null
  }
}

const imageSrc = ref('')
// Actualiza la previsualización según si el usuario selecciona archivo o usa una URL
const toggleCoverURL = () => {
  toggleURL.value = !toggleURL.value
  if (toggleURL.value) {
    // Mostrar el campo de URL y limpiar la selección de archivo
    selectedFile.value = null
    imageSrc.value = imageURL.value || avatar.value
  } else {
    // Limpiar la URL cuando se selecciona un archivo
    imageURL.value = avatar.value
    imageSrc.value = selectedFile.value || avatar.value
  }
}
// Maneja el archivo cargado
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
      image.value = e.target.result // Muestra una vista previa de la imagen cargada
    }
    reader.readAsDataURL(file)
  }
}

const avatarPreview = (event) => {
  const textUrl = event.target.value
  imageSrc.value = textUrl
}

onMounted(() => {
  if (user && user.value && user.value.userId) {
    GetUserData()
  } else {
    errorMessage.value = 'User is not authenticated'
  }
  checkAuth(user)
})
</script>

<template>
  <div class="px-6 max-w-2xl w-full mx-auto">
    <h1 class="text-2xl font-bold text-slate-100 mb-4">Account Settings</h1>

    <div class="p-6 bg-glass rounded-md mt-4">
      <form @submit.prevent="UpdateUser">
        <!-- Settings Section -->
        <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-5 my-6">
          <div class="flex mx-auto my-6">
            <img
              id="userAvatar"
              :src="`${imageSrc}`"
              alt="user"
              v-if="imageSrc"
              class="object-cover bg-yellow-500 border border-slate-800 h-64 w-64 rounded-md"
            />
          </div>

          <div>
            <div class="mb-4">
              <label for="image" class="block text-2xl text-white font-medium">Avatar</label>
              <!-- Toggler -->
              <div
                class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
              >
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  @click="toggleCoverURL"
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  for="toggle"
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-yellow-500 cursor-pointer"
                ></label>
              </div>
              <label for="toggle" class="text-xs text-white"
                >Toggle to switch between upload and enter URL.</label
              >

              <!-- Inputs -->
              <input
                type="file"
                id="image"
                @change="handleFileUpload"
                v-show="!toggleURL"
                class="input"
              />
              <input
                type="text"
                id="imageURL"
                @input="avatarPreview"
                v-model="imageURL"
                v-show="toggleURL"
                class="input"
              />
            </div>

            <div class="mb-4">
              <label for="name" class="block text-md font-semibold text-slate-100">Name</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="input disabled"
                placeholder="Enter your name"
                disabled
              />
            </div>
            <div class="mb-4">
              <label for="email" class="block text-md font-semibold text-slate-100">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="input"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div>
            <div class="mb-4">
              <label for="current_password" class="block text-md font-semibold text-slate-100"
                >Current Password</label
              >
              <input
                type="password"
                id="current_password"
                v-model="current_password"
                required
                class="input"
                placeholder="Enter your current password"
              />
            </div>
            <div class="mb-4">
              <label for="new_password" class="block text-md font-semibold text-slate-100"
                >New Password</label
              >
              <input type="input" placeholder="Enter your new password" class="input" />
            </div>
            <div class="mb-4">
              <label for="confirm_password" class="block text-md font-semibold text-slate-100"
                >Confirm New Password</label
              >
              <input
                type="password"
                id="confirm_password"
                v-model="confirm_password"
                class="input"
                placeholder="Confirm your password"
              />
            </div>
            <button
              class="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition duration-150"
            >
              Save
            </button>
          </div>
          <!-- Settings Section -->
        </div>
        <div class="flex justify-center items-center"></div>
      </form>
      <ErrorMessage
        :message="errorMessage"
        type="error"
        :autoClose="false"
        :autoCloseDelay="5000"
      />
      <SuccessMessage
        :message="successMessage"
        type="success"
        :autoClose="false"
        :autoCloseDelay="5000"
      />
    </div>
    <!-- Reading Settings -->
    <h1 id="reading" class="text-2xl font-bold text-slate-100 my-6">Reading Settings</h1>
    <div>
      <form @submit.prevent="UpdateReadingSettings">
        <div class="bg-glass p-4 mb-4 text-white rounded-md">
          <h2 class="text-xl font-semibold text-yellow-500">Chapter Text Size</h2>
          <label class="text-sm"
            >Determine how big your text will be, to make it easier to read your chapters, the
            default is 16px</label
          >
          <input
            type="text"
            class="input oldstyle-nums"
            v-model="fontSize"
            name="fontSize"
            placeholder="Enter text size (pixels)"
          />
          <p>
            Current text size:
            <strong :class="`text-[${fontSize}px] oldstyle-nums`">{{ fontSize }} pixels</strong>
          </p>
          <button
            class="w-1/4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition duration-150"
          >
            Save
          </button>
          <p class="text-yellow-500">{{ fontSizeInfo }}</p>
        </div>
      </form>
    </div>
    <!-- Profile Settings -->
    <h1 id="reading" class="text-2xl font-bold text-slate-100 my-6">Profile Settings</h1>
    <div>
      <form @submit.prevent="updateHeaderImage">
        <div class="bg-glass p-4 mb-4 text-white rounded-md">
          <h2 class="text-xl font-semibold text-yellow-500">Header Picture</h2>
          <label class="text-sm"
            >Set a picture that will be displayed at the top of your profile (H - 200px )</label
          >
          <input
            type="text"
            class="input"
            v-model="headerImageUrl"
            name="headerImageUrl"
            placeholder="Enter header image URL"
          />
          <button
            class="w-1/4 mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition duration-150"
          >
            Save
          </button>
          <ErrorMessage
            :message="headerErrorMessage"
            type="error"
            :autoClose="false"
            :autoCloseDelay="5000"
          />
          <SuccessMessage
            :message="headerSuccessMessage"
            type="success"
            :autoClose="false"
            :autoCloseDelay="5000"
          />
        </div>
      </form>
    </div>
  </div>
</template>
