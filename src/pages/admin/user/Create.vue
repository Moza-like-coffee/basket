<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useResponseStore } from '@/stores/response'

const router = useRouter()
const userStore = useUserStore()
const responseStore = useResponseStore()

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: '',
})

async function submit() {
  await userStore.create(form.value)
}
</script>

<template>
  <AdminLayouts backRoute="admin.user.index">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5">
        <form @submit.prevent="submit" class="space-y-3">
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="text-sm px-3">Informasi User</legend>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-sm" for="name">Nama Lengkap</label>
                <input
                  id="name"
                  type="text"
                  v-model="form.name"
                  placeholder="Masukkan Nama Lengkap"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="username">Username</label>
                <input
                  id="username"
                  type="text"
                  v-model="form.username"
                  placeholder="Masukkan Username"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                />
              </div>

              <div class="space-y-1 col-span-2">
                <label class="block text-sm" for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model="form.email"
                  placeholder="Masukkan Email"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="password">Password</label>
                <input
                  id="password"
                  type="password"
                  v-model="form.password"
                  placeholder="Masukkan Password"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="password_confirmation">Konfirmasi Password</label>
                <input
                  id="password_confirmation"
                  type="password"
                  v-model="form.password_confirmation"
                  placeholder="Konfirmasi Password"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                />
              </div>

              <div class="space-y-1 col-span-2">
                <label class="block text-sm" for="role">Role</label>
                <select
                  id="role"
                  v-model="form.role"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-sm w-full focus:outline-1 focus:outline-gray-500"
                  required
                >
                  <option value="" disabled selected>Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="coach">Coach</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </div>
          </fieldset>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="userStore.isLoading"
              class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ userStore.isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayouts>
</template>
