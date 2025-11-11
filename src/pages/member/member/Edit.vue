<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { useMemberStore } from '@/stores/member'
import { useParentStore } from '@/stores/parent'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const memberStore = useMemberStore()
const route = useRoute()
const member = ref()

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

  parent_name: null,
  parent_phone_number: null,
  parent_email: null,
  parent_address: null,
})

onMounted(async () => {
  const withRelation = 'file'
  await memberStore.getById(route.params.id, withRelation)

  member.value = memberStore.data

  form.value.name = member.value.name
  form.value.gender = member.value.gender
  form.value.place_of_birth = member.value.place_of_birth
  form.value.date_of_birth = member.value.date_of_birth
  form.value.school = member.value.school
  form.value.school_grade = member.value.school_grade
  form.value.disease = member.value.disease
  form.value.is_former_club = Boolean(member.value.is_former_club)
  form.value.former_club = member.value.former_club
  form.value.former_club_year = member.value.former_club_year
  form.value.parent_name = member.value.parent_name
  form.value.parent_phone_number = member.value.parent_phone_number
  form.value.parent_email = member.value.parent_email
  form.value.parent_address = member.value.parent_address
})

function validatePhoneNumber(event) {
  form.value.parent_phone_number = event.target.value.replace(/\D/g, '')
}
function validatePhoneFormat() {
  let phone = form.value.parent_phone_number

  if (phone.startsWith('08')) {
    form.value.parent_phone_number = '628' + phone.slice(2)
  }
}

async function submit() {
  await memberStore.update(form.value, route.params.id)
}
</script>
<template>
  <MemberLayouts backRoute="member.index">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5">
        <form @submit.prevent="submit" class="space-y-3">
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="md:text-sm text-xs px-3">Informasi Member</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
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
              <div class="space-y-1">
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
                  >Tanggal Lahir</label
                >
                <input
                  :disabled="member?.file !== null"
                  id="form-date-of-birth"
                  type="date"
                  v-model="form.date_of_birth"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tanggal Lahir"
                  required
                />
              </div>
              <div class="space-y-1">
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
              <div class="space-y-1">
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
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Tahun Terakhir Bergabung"
                  required
                />
              </div>
            </div>
          </fieldset>
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="md:text-sm text-xs px-3">Informasi Orangtua</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1 col-span-2">
                <label class="block md:text-sm text-xs" for="form-parent-name">Nama Lengkap</label>
                <input
                  id="form-parent-name"
                  type="text"
                  v-model="form.parent_name"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Nama Lengkap Orang Tua"
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="block md:text-sm text-xs" for="form-parent-phone-number"
                  >Nomor Handphone</label
                >
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
                  required
                />
              </div>
              <div class="space-y-1">
                <label class="block md:text-sm text-xs" for="form-parent-email">Email</label>
                <input
                  id="form-parent-email"
                  type="email"
                  v-model="form.parent_email"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Email"
                  required
                />
              </div>
              <div class="space-y-1 col-span-2">
                <label class="block md:text-sm text-xs" for="form-parent-address">Alamat</label>
                <textarea
                  id="form-parent-address"
                  rows="4"
                  v-model="form.parent_address"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500"
                  placeholder="Masukkan Alamat"
                  required
                >
                </textarea>
              </div>
            </div>
          </fieldset>
          <div class="flex justify-end gap-3">
            <button
              type="submit"
              class="md:text-sm text-xs bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </MemberLayouts>
</template>
