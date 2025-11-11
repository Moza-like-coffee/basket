<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { useMemberStore } from '@/stores/member'
import { useParentStore } from '@/stores/parent'
import { FileUpload } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import placeholderImage from '@/assets/images/placeholder-person.webp'

const memberStore = useMemberStore()
const member = ref()
const route = useRoute()

const form = ref({
  photo: null,
  birth_certificate: null,
  family_card: null,
  club_release_letter: null,
  is_have_bpjs: false,
  bpjs: null,
  member_id: route.params.id,
})

const imageSrc = ref(placeholderImage)

onMounted(async () => {
  await memberStore.getById(route.params.id)

  member.value = memberStore.data
})

async function submit() {
  await memberStore.verificationFiles(form.value)
}

const changePlaceholder = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageSrc.value = URL.createObjectURL(file)
    form.value.photo = file
  }
}

const handleUploadFile = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    form.value[type] = file
  }
}
</script>
<template>
  <MemberLayouts backRoute="member.index">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5">
        <form @submit.prevent="submit" class="space-y-3">
          <fieldset class="border border-gray-300 rounded-lg shadow p-5">
            <legend class="md:text-sm text-xs px-3">Verifikasi Dokumen</legend>
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2 flex justify-center">
                <div class="flex justify-center !w-32 flex-none">
                  <div class="relative">
                    <img
                      id="picture"
                      :src="imageSrc"
                      class="object-cover !w-32 !h-32 rounded-lg border border-gray-300 shadow-lg"
                      alt="Placeholder Image"
                    />
                    <div
                      class="absolute z-50 top-0 hover:!opacity-100 rounded-lg cursor-pointer"
                      style="opacity: 0"
                    >
                      <label for="pictureInput">
                        <div
                          class="!w-32 !h-32 bg-black opacity-60 flex items-center rounded-lg cursor-pointer"
                        >
                          <p class="text-center w-full">
                            <i class="fa-solid fa-pen" style="color: #ffffff"></i>
                          </p>
                        </div>
                        <input
                          accept="image/*"
                          type="file"
                          class="absolute bottom-0 opacity-0 w-40 h-2"
                          id="pictureInput"
                          required
                          @change="changePlaceholder"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1">
                <label class="block md:text-sm text-xs" for="form-birth-certificate"
                  >Akta Kelahiran</label
                >
                <input
                  id="form-birth-certificate"
                  type="file"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500 cursor-pointer"
                  @change="(event) => handleUploadFile(event, 'birth_certificate')"
                  required
                />
              </div>
              <div class="space-y-1 col-span-2 md:col-span-1">
                <label class="block md:text-sm text-xs" for="form-family-card"
                  >Kartu Keluarga</label
                >
                <input
                  id="form-family-card"
                  type="file"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500 cursor-pointer"
                  @change="(event) => handleUploadFile(event, 'family_card')"
                  required
                />
              </div>
              <div class="col-span-2 space-y-1" v-if="member?.is_former_club">
                <label class="block md:text-sm text-xs" for="form-club-release-letter"
                  >Surat Peleapasan Club Lama</label
                >
                <input
                  id="form-club-release-letter"
                  type="file"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500 cursor-pointer"
                  @change="(event) => handleUploadFile(event, 'club_release_letter')"
                />
              </div>
              <div class="col-span-2 flex gap-2">
                <input
                  id="form-is-have-bpjs"
                  type="checkbox"
                  v-model="form.is_have_bpjs"
                  class="px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-1 focus:outline-gray-500"
                />
                <label class="block md:text-sm text-xs select-none" for="form-is-have-bpjs"
                  >Member Memiliki Kartu BPJS Aktif</label
                >
              </div>
              <div class="col-span-2 space-y-1" v-if="form.is_have_bpjs">
                <label class="block md:text-sm text-xs" for="form-bpjs">BPJS</label>
                <input
                  id="form-bpjs"
                  type="file"
                  class="px-2.5 py-2 border border-gray-300 shadow md:text-sm text-xs rounded-lg w-full focus:outline-1 focus:outline-gray-500 cursor-pointer"
                  @change="(event) => handleUploadFile(event, 'bpjs')"
                  required
                />
              </div>
            </div>
          </fieldset>
          <div class="flex justify-end">
            <button
              type="submit"
              class="md:text-sm text-xs bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  </MemberLayouts>
</template>
