<template>
  <section class="bg-glass max-w-6xl p-4">
    <form @submit.prevent="UpdateUser">
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <div class="p-4">
          <div class="mb-6 p-4">
            <label class="text-2xl">
              <p class="text-white">{{ accountEdited.name }}'s name | NEW: {{ account.name }}</p>
              <p>
                <input class="input" type="text" name="name" v-model="account.name" :placeholder="accountEdited.name" />
              </p>
            </label>
          </div>
          <div class="mb-6">
            <label class="text-2xl">
              <p class="text-white">{{ accountEdited.name }}'s E-mail | NEW: {{ account.email }}</p>
              <p>
                <input class="input" type="text" name="email" v-model="account.email"
                  :placeholder="accountEdited.email" />
              </p>
            </label>
          </div>
          <div class="mb-6">
            <label class="text-2xl">
              <p class="text-white">{{ accountEdited.name }}'s Role | NEW: {{ account.role }}</p>
              <p>
                <input class="input" type="text" name="role" v-model="account.role" :placeholder="accountEdited.role" />
              </p>
            </label>
          </div>
        </div>

        <div class="p-4">
          <div class="mb-6">
            <label class="text-2xl">
              <p class="text-white">
                {{ accountEdited.name }}'s Avatar | NEW: {{ account.avatar }}
              </p>
              <p>
                <input class="input" type="text" name="role" v-model="account.avatar"
                  :placeholder="accountEdited.avatar" />

                <img v-if="accountEdited.header_image" :src="accountEdited.avatar || account.avatar"
                  class="h-[200PX] border" />
              </p>
            </label>
          </div>
          <div class="mb-6">
            <label class="text-2xl">
              <p class="text-white">
                {{ accountEdited.name }}'s Avatar | NEW: {{ account.header_image }}
              </p>
              <p>
                <input class="input" type="text" name="role" v-model="account.header_image"
                  :placeholder="accountEdited.header_image" />
                <img v-if="accountEdited.header_image" :src="account.header_image || accountEdited.header_image"
                  class="w-15 h-15 border" />
              </p>
            </label>
          </div>
        </div>
      </div>

      <div class="w-full gap-6">
        <Btn w="full" href="/hk/manage-users" variant="danger">Back</Btn>
        <Btn variant="success">Submit</Btn>
      </div>
    </form>

    <div class="block">
      <Btn w="full" @click="showModal = true" variant="danger">Delete {{ accountEdited.name }}</Btn>
    </div>

    <Modal :showModal="showModal" title="Delete User" @update:showModal="showModal = $event">
      <p class="text-white my-2">Are you sure you want to delete this user?</p>
      <input class="input" v-model="deletePhrase" type="text"
        :placeholder="`Enter 'Delete ${accountEdited.name}' to delete`" />
      <p class="text-red-500 my-2" v-if="deletePhrase !== `Delete ${accountEdited.name}`">
        Invalid delete phrase
      </p>
      <div class="modal-actions">
        <Btn variant="danger" @click="DeleteUser">Delete user</Btn>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import Cookies from 'js-cookie'

const route = useRoute()
const userId = route.params.userId
const account = ref({})
const accountEdited = ref({})
const imageSrc = ref('')
const deletePhrase = ref('')

onMounted(async () => {
  try {
    const data = await axios.get(`${import.meta.env.VITE_API}/users/${userId}`)
    const res = data.data
    accountEdited.value = res
  } catch (error) {
    toast.error(`${error}`)
  }
})

const UpdateUser = async () => {
  const token = Cookies.get('accessToken')
  try {
    const updateData = {
      name: account.value.name,
      email: account.value.email,
      role: account.value.role,
      avatar: account.value.avatar,
      header_image: account.value.header_image
    }
    const response = await axios.put(`${import.meta.env.VITE_API}/users/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200) {
      toast.success(`${accountEdited.value.name} edited successfully`, {
        autoClose: false
      })
    }
  } catch (error) {
    toast.error(`ERROR: ${error}`, {
      autoClose: false
    })
  }
}

const DeleteUser = async () => {
  const token = Cookies.get('accessToken')
  if (deletePhrase.value === `Delete ${accountEdited.value.name}`) {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(`${account.value.name} was deleted successfully`, {
        autoClose: false
      })
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(`404: ${error}`, {
          autoClose: false
        })
      } else {
        toast.error(`ERROR: ${error}`, {
          autoClose: false
        })
      }
    } finally {
      toast.error(`?`, {
        autoClose: false
      })
    }
  } else {
    toast.error(`Please type "delete" to confirm deletion`, {
      autoClose: false
    })
  }
}
</script>
