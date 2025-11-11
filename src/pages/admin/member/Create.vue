<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useMemberStore } from '@/stores/member'
import { useParentStore } from '@/stores/parent'
import { onMounted, ref, watch } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

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
  parents.value = parentStore.datas
})

watch(
  () => form.value.parent_id,
  (selected) => {
    const selectedParent = parents.value.find((p) => p.id === selected?.id)
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
  },
)

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
            <legend class="md:text-sm text-xs px-3">Informasi Member</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1 md:col-span-1 col-span-2">
                <label class="block md:text-sm text-xs" for="form-name">Nama Lengkap</label>
                <input
                  id="form-name"
                  type="text"
                  v-model="form.name"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Lengkap Member"
                  required
                />
              </div>
              <div class="space-y-1 md:col-span-1 col-span-2">
                <label class="block md:text-sm text-xs" for="form-gender">Jenis Kelamin</label>
                <select
                  id="form-gender"
                  v-model="form.gender"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500h-[37.33px]"
                  required
                >
                  <option value="" selected disabled>Pilih Jenis Kelamin</option>
                  <option value="Laki Laki">Laki Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="block md:text-sm text-xs" for="form-place-of-birth"
                  >Tempat Lahir</label
                >
                <input
                  id="form-place-of-birth"
                  type="text"
                  v-model="form.place_of_birth"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tempat Lahir"
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="block md:text-sm text-xs" for="form-date-of-birth"
                  >Tanggal Lahir <span v-if="form?.ageGroup">({{ form.ageGroup }})</span></label
                >
                <div class="flex gap-3">
                  <input
                    id="form-date-of-birth"
                    type="date"
                    @change="calculateAgeGroup"
                    v-model="form.date_of_birth"
                    class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                    placeholder="Masukkan Tanggal Lahir"
                    required
                  />
                  <div class="md:flex hidden text-sm items-center whitespace-nowrap">
                    <p>Kelompok Umur: {{ form.ageGroup }}</p>
                  </div>
                </div>
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1">
                <label class="block md:text-sm text-xs" for="form-school">Asal Sekolah</label>
                <input
                  id="form-school"
                  type="text"
                  v-model="form.school"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Asal Sekolah"
                  required
                />
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1">
                <label class="block md:text-sm text-xs" for="form-school-grade">Kelas</label>
                <input
                  id="form-school-grade"
                  type="text"
                  v-model="form.school_grade"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Kelas"
                  required
                />
              </div>
              <div class="col-span-2 space-y-1">
                <label class="block md:text-sm text-xs" for="form-disease">Penyakit/Kelainan</label>
                <input
                  id="form-disease"
                  type="text"
                  v-model="form.disease"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Penyakit/Kelainan yang perlu kita ketahui"
                />
              </div>
              <div class="col-span-2 flex gap-2">
                <input
                  id="form-is-former-club"
                  type="checkbox"
                  v-model="form.is_former_club"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-1 focus:outline-gray-500"
                />
                <label class="block md:text-sm text-xs select-none" for="form-is-former-club"
                  >Member pernah terdaftar atau bermain di club lain</label
                >
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1" v-if="form.is_former_club">
                <label class="block md:text-sm text-xs" for="form-former-club"
                  >Nama Club Sebelumnya</label
                >
                <input
                  id="form-former-club"
                  type="text"
                  v-model="form.former_club"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Club Sebelumnya"
                  required
                />
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1" v-if="form.is_former_club">
                <label class="block md:text-sm text-xs" for="form-former-club-year"
                  >Tahun Bergabung</label
                >
                <input
                  id="form-former-club-year"
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  v-model="form.former_club_year"
                  class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tahun Terakhir Bergabung"
                  required
                />
              </div>
            </div>
          </fieldset>
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="md:text-sm text-xs px-3">Informasi Orangtua</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1 col-span-2 relative">
                <label for="form-parent" class="block md:text-sm text-xs font-medium text-gray-800">
                  Nama Lengkap Orang Tua
                </label>

                <div class="relative">
                  <multiselect
                    id="form-parent"
                    v-model="form.parent_id"
                    :options="parents"
                    placeholder="Pilih Orang Tua"
                    :select-label="'Tekan enter untuk Memilih'"
                    :selected-label="'Klik untuk Menghapus'"
                    :deselect-label="'Klik untuk Menghapus'"
                    :required="true"
                    :show-no-options="true"
                    :show-no-result="true"
                    :no-result="'t'"
                    label="name"
                    track-by="id"
                    :multiple="false"
                    :searchable="true"
                    :allow-empty="true"
                    :close-on-select="true"
                    :preserve-search="true"
                    class="w-full md:!text-sm !text-xs bg-white"
                  >
                  </multiselect>
                </div>
              </div>

              <div class="space-y-1 md:col-span-1 col-span-2">
                <label class="block text-sm" for="form-parent-phone-number">Nomor Handphone</label>
                <input
                  id="form-parent-phone-number"
                  type="text"
                  v-model="form.parent_phone_number"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nomor Handphone"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  maxlength="15"
                  @input="validatePhoneNumber"
                  @blur="validatePhoneFormat"
                />
              </div>

              <div class="space-y-1 md:col-span-1 col-span-2">
                <label class="block text-sm" for="form-parent-email">Email</label>
                <input
                  id="form-parent-email"
                  type="email"
                  v-model="form.parent_email"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Email"
                />
              </div>

              <div class="space-y-1 col-span-2">
                <label class="block text-sm" for="form-parent-address">Alamat</label>
                <textarea
                  id="form-parent-address"
                  rows="4"
                  v-model="form.parent_address"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Alamat"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <div class="flex justify-end gap-3">
            <button
              @click="form.isNext = false"
              type="submit"
              class="md:text-sm text-xs bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Simpan
            </button>
            <button
              @click="form.isNext = true"
              type="submit"
              class="md:text-sm text-xs bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Simpan dan Lanjutkan Verifikasi Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayouts>
</template>
<style scoped>
::v-deep .multiselect__tags {
  min-height: auto;
  background-color: white !important;
  border-radius: 9px;
  border: 1px solid #d1d5dc;
  color: black;
  --tw-shadow:
    0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)),
    0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow:
    var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
    var(--tw-ring-shadow), var(--tw-shadow);
  font-size: 14px;
  padding: 8px 10px;
}
::v-deep .multiselect__placeholder {
  margin-bottom: 0;
  padding: 0;
}
::v-deep .multiselect__input {
  font-size: 14px;
  margin-bottom: 0;
  padding: 0;
}
::v-deep .multiselect__single {
  font-size: 14px;
  margin-bottom: 0;
  padding: 0;
}
</style>
