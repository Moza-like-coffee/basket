<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useMemberStore } from '@/stores/member'
import { useParentStore } from '@/stores/parent'
import { onMounted, ref, watch } from 'vue'
import Multiselect from 'vue-multiselect'

const parentStore = useParentStore()
const memberStore = useMemberStore()

const form = ref({
  name: null,
  gender: '',
  place_of_birth: null,
  date_of_birth: null,
  school: null,
  school_grade: null,
  disease: null,
  is_former_club: null,
  former_club: null,
  former_club_year: null,

  parent_id: null,
  parent_name: null,
  parent_phone_number: null,
  parent_email: null,
  parent_address: null,

  isNext: false,
})

const parents = ref([])

onMounted(async () => {
  await parentStore.getAll()
  parents.value = parentStore.datas ?? []
})

watch(() => form.value.parent_id, (selected) => {
  const selectedParent = parents.value.find(p => p.id === selected?.id)
  if (selectedParent) {
    form.value.parent_name = selectedParent.name
    form.value.parent_phone_number = selectedParent.phone_number
    form.value.parent_email = selectedParent.email
    form.value.parent_address = selectedParent.address
  } else {
    form.value.parent_phone_number = null
    form.value.parent_email = null
    form.value.parent_address = null
  }
})

function validatePhoneNumber(event) {
  form.value.parent_phone_number = event.target.value.replace(/\D/g, '')
}

function validatePhoneFormat() {
  let phone = form.value.parent_phone_number
  if (phone && phone.startsWith('08')) {
    form.value.parent_phone_number = '628' + phone.slice(2)
  }
}

async function submit() {
  const payload = {
    ...form.value,
    parent_id: form.value.parent_id?.id || null,
  }
  await memberStore.post(payload, form.value.isNext)
}
</script>

<template>
  <AdminLayouts backRoute="admin.member.index">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5">
        <form @submit.prevent="submit" class="space-y-3">
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="text-sm px-3">Informasi Member</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="block text-sm" for="form-name">Nama Lengkap</label>
                <input id="form-name" type="text" v-model="form.name"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Lengkap Member" required />
              </div>
              <div class="space-y-1">
                <label class="block text-sm" for="form-gender">Jenis Kelamin</label>
                <select id="form-gender" v-model="form.gender"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500h-[37.33px]"
                  required>
                  <option value="" selected disabled>Pilih Jenis Kelamin</option>
                  <option value="Laki Laki">Laki Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-sm" for="form-place-of-birth">Tempat Lahir</label>
                <input id="form-place-of-birth" type="text" v-model="form.place_of_birth"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tempat Lahir" required />
              </div>
              <div class="space-y-1">
                <label class="block text-sm" for="form-date-of-birth">Tanggal Lahir</label>
                <input id="form-date-of-birth" type="date" v-model="form.date_of_birth"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tanggal Lahir" required />
              </div>
              <div class="space-y-1">
                <label class="block text-sm" for="form-school">Asal Sekolah</label>
                <input id="form-school" type="text" v-model="form.school"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Asal Sekolah" required />
              </div>
              <div class="space-y-1">
                <label class="block text-sm" for="form-school-grade">Kelas</label>
                <input id="form-school-grade" type="text" v-model="form.school_grade"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Kelas" required />
              </div>
              <div class="col-span-2 space-y-1">
                <label class="block text-sm" for="form-disease">Penyakit/Kelainan</label>
                <input id="form-disease" type="text" v-model="form.disease"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Penyakit/Kelainan yang perlu kita ketahui" />
              </div>
              <div class="col-span-2 flex gap-2">
                <input id="form-is-former-club" type="checkbox" v-model="form.is_former_club"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-1 focus:outline-gray-500" />
                <label class="block text-sm select-none" for="form-is-former-club">Member pernah terdaftar atau bermain
                  di club lain</label>
              </div>
              <div class="space-y-1" v-if="form.is_former_club">
                <label class="block text-sm" for="form-former-club">Nama Club Sebelumnya</label>
                <input id="form-former-club" type="text" v-model="form.former_club"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Club Sebelumnya" required />
              </div>
              <div class="space-y-1" v-if="form.is_former_club">
                <label class="block text-sm" for="form-former-club-year">Tahun Bergabung</label>
                <input id="form-former-club-year" type="number" min="1900" max="2099" step="1"
                  v-model="form.former_club_year"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tahun Terakhir Bergabung" required />
              </div>
            </div>
          </fieldset>
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="text-sm px-3">Informasi Orangtua</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1 col-span-2 relative">
                <label for="form-parent" class="block text-sm font-medium text-gray-800">
                  Nama Lengkap Orang Tua
                </label>

                <div class="relative">
                  <multiselect id="form-parent" v-model="form.parent_id" :options="parents"
                    placeholder="Pilih Orang Tua" label="name" track-by="id" :searchable="true" :allow-empty="true"
                    :show-labels="false" :close-on-select="true" :clear-on-select="false" :preserve-search="true" class="w-full text-sm bg-white border border-gray-300 rounded-lg shadow-sm 
             focus-within:ring-2 focus-within:ring-rhino-800 focus-within:border-rhino-900 
             px-3 py-2 transition-all duration-200 ease-in-out hover:border-gray-400">
                    <template #singleLabel="{ option }">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-user text-gray-500"></i>
                        <span class="text-gray-800">{{ option.name }}</span>
                      </div>
                    </template>

                    <template #option="{ option }">
                      <div class="flex items-center gap-2 px-2 py-1.5 hover:bg-indigo-50 rounded-md transition">
                        <i class="fa-solid fa-user text-indigo-500"></i>
                        <span class="text-gray-700">{{ option.name }}</span>
                      </div>
                    </template>
                  </multiselect>

                  <!-- Tombol Hapus (X) -->
                  <button v-if="form.parent_id" type="button" @click="form.parent_id = null" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 
             transition-colors duration-150 ease-in-out" title="Hapus pilihan">
                    <i class="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              </div>



              <div class="space-y-1">
                <label class="block text-sm" for="form-parent-phone-number">Nomor Handphone</label>
                <input id="form-parent-phone-number" type="text" v-model="form.parent_phone_number"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nomor Handphone" pattern="[0-9]*" inputmode="numeric" maxlength="15"
                  @input="validatePhoneNumber" @blur="validatePhoneFormat" />
              </div>

              <div class="space-y-1">
                <label class="block text-sm" for="form-parent-email">Email</label>
                <input id="form-parent-email" type="email" v-model="form.parent_email"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Email" />
              </div>

              <div class="space-y-1 col-span-2">
                <label class="block text-sm" for="form-parent-address">Alamat</label>
                <textarea id="form-parent-address" rows="4" v-model="form.parent_address"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Alamat"></textarea>
              </div>
            </div>
          </fieldset>

          <div class="flex justify-end gap-3">
            <button @click="form.isNext = false" type="submit"
              class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg">
              Simpan
            </button>
            <button @click="form.isNext = true" type="submit"
              class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg">
              Simpan dan Lanjutkan Verifikasi Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </adminLayouts>
</template>
