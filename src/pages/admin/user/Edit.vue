<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const user = ref()

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)

onMounted(async () => {
  await userStore.getById(route.params.id)

  user.value = userStore.data

  form.value.name = user.value.name
  form.value.username = user.value.username
  form.value.email = user.value.email
  form.value.role = user.value.role
})

async function submit() {
  loading.value = true
  try {
    const payload = { ...form.value }
    if (!payload.password) delete payload.password

    await userStore.update(payload, route.params.id)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayouts backRoute="admin.user.index">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5">
        <form @submit.prevent="submit" class="space-y-3">
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="text-sm px-3">Edit Data User</legend>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-sm" for="form-name">Nama Lengkap</label>
                <input
                  id="form-name"
                  type="text"
                  v-model="form.name"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Lengkap"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="form-username">Username</label>
                <input
                  id="form-username"
                  type="text"
                  v-model="form.username"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Username"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="form-email">Email</label>
                <input
                  id="form-email"
                  type="email"
                  v-model="form.email"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Email"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="form-password">Password</label>
                <input
                  id="form-password"
                  type="password"
                  v-model="form.password"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Kosongkan jika tidak ingin mengganti password"
                />
              </div>
            </div>
          </fieldset>

          <div class="flex justify-end gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayouts>
</template>
