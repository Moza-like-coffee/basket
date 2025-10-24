<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'

const toast = useToast()
const router = useRouter()
const trainingStore = useTrainingStore()
const memberStore = useMemberStore()

const training = ref([])
const loading = ref(true)

function calculateAgeGroup(dateOfBirth) {
  if (dateOfBirth) {
    const thisYear = new Date().getFullYear()
    const birthYear = new Date(dateOfBirth).getFullYear()
    const age = thisYear - birthYear
    return age
  } else {
    return ''
  }
}

function getKUsFromData(data, dataType = 'member') {
  if (!data || data.length === 0) {
    return '-'
  }

  const kuSet = new Set()

  data.forEach((item) => {
    const dateOfBirth = dataType === 'member' ? item.date_of_birth : item.member?.date_of_birth

    const ku = calculateAgeGroup(dateOfBirth)
    if (ku) kuSet.add(ku)
  })

  const kus = Array.from(kuSet).sort((a, b) => a - b)
  return kus.length > 0 ? kus.join(', ') : '-'
}

function getMemberKUs(members) {
  return getKUsFromData(members, 'member')
}

const schedules = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return training.value
    .filter((schedule) => {
      const scheduleDate = new Date(schedule.date)
      scheduleDate.setHours(0, 0, 0, 0)
      return scheduleDate >= today
    })
    .map((schedule) => ({
      label: new Date(schedule.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      value: schedule.id,
      date: schedule.date,
      title: schedule.title,
      ku: getMemberKUs(schedule.members),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

function selectSchedule(scheduleId) {
  router.push({
    name: 'coach.attendance.show',
    params: {
      id: scheduleId,
    },
  })
}

async function fetchData() {
  training.value = trainingStore.datas
}

onMounted(async () => {
  loading.value = true
  await Promise.all([trainingStore.get(), memberStore.getByParentId()])
  fetchData()
  loading.value = false
})
</script>

<template>
  <CoachLayouts>
    <div class="py-3 space-y-3">
      <div class="bg-white rounded-lg shadow px-5 py-6">
        <div v-if="loading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl text-gray-400 mb-2"></i>
          <p class="text-gray-500">Memuat jadwal latihan...</p>
        </div>

        <div v-else-if="schedules.length > 0" class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">
            Pilih jadwal latihan untuk melihat dan mengelola absensi anggota
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div
              v-for="s in schedules"
              :key="s.value"
              @click="selectSchedule(s.value)"
              class="cursor-pointer rounded-xl border-2 shadow-sm p-3 text-left transition-all duration-300 hover:shadow-lg hover:border-piper-500 hover:scale-105 flex flex-col justify-between bg-white border-gray-200 text-gray-700"
            >
              <div class="justify-center w-full">
                <!-- Title -->
                <div class="mb-3 flex gap-2 items-center">
                  <i class="fa-solid fa-calendar text-xl text-piper-500"></i>
                  <p class="font-semibold text-base !align-middle line-clamp-1">
                    {{ s.title }}
                  </p>
                </div>

                <!-- Date -->
                <p class="text-sm mb-1 text-gray-600">
                  {{ s.label }}
                </p>

                <!-- KU Information -->
                <div class="mt-auto">
                  <span
                    class="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-rhino-100 text-grey-600"
                  >
                    KU: {{ s.ku }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <i class="pi pi-calendar-times text-3xl mb-3 text-gray-400"></i>
          <p class="text-lg font-medium mb-2">Tidak ada jadwal latihan</p>
          <p class="text-sm">Tidak ada jadwal latihan yang akan datang</p>
        </div>
      </div>
    </div>
  </CoachLayouts>
</template>
