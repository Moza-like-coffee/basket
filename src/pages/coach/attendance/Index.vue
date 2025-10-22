<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { DataTable, Column, Dialog } from 'primevue'
import { ref, computed, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

import { useAttendanceStore } from '@/stores/attendance'
import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'
import { useUIStore } from '@/stores/ui'

const toast = useToast()
const uiStore = useUIStore()
const attendanceStore = useAttendanceStore()
const trainingStore = useTrainingStore()
const memberStore = useMemberStore()

const attendance = ref([])
const training = ref([])
const member = ref([])

const selectedSchedule = ref('')
const searchQuery = ref('')
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const showQRScanner = ref(false)
const qrError = ref('')

const selectedMember = ref(null)
const formStatus = ref('present')
const formReason = ref('')

// qr scanner state
const scanResult = ref(null)
const scanLoading = ref(false)
const cameraPermission = ref('')

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
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

const datas = computed(() => {
  return member.value.map((member, index) => {
    const attendance = attendanceStore.datas.find(
      (a) => a.member_id === member.id && a.training_schedule_id === selectedSchedule.value,
    )
    return {
      id: member.id,
      name: member.name,
      gender: member.gender === 'Laki Laki' ? 'Laki-laki' : 'Perempuan',
      date_of_birth: member.date_of_birth,
      status: attendance
        ? attendance.status === 'present'
          ? 'Hadir'
          : attendance.status === 'absent'
            ? 'Tidak Hadir'
            : attendance.status
        : 'Belum Absen',
      reason: attendance?.reason || '',
      attendance_id: attendance?.id || null,
    }
  })
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

function calculateAgeGroup(date) {
  if (date) {
    const thisYear = new Date().getFullYear()
    const birthYear = new Date(date).getFullYear()
    const age = thisYear - birthYear
    return age
  } else {
    return ''
  }
}

function openAttendanceModal(member) {
  selectedMember.value = member
  formStatus.value =
    member.status === 'Hadir' ? 'present' : member.status === 'Tidak Hadir' ? 'absent' : 'present'
  formReason.value = member.reason !== '-' ? member.reason : ''
  showModal.value = true
}

async function saveManualAttendance() {
  if (!selectedSchedule.value)
    return toast.add({
      severity: 'error',
      summary: 'Silakan pilih jadwal latihan terlebih dahulu.',
      life: 3000,
    })

  if (formStatus.value === 'absent' && !formReason.value.trim())
    return toast.add({
      severity: 'error',
      summary: 'Harap isi alasan ketidakhadiran.',
      life: 3000,
    })

  saving.value = true
  const form = {
    member_id: selectedMember.value.id,
    training_schedule_id: selectedSchedule.value,
    status: formStatus.value,
    reason: formStatus.value === 'absent' ? formReason.value : null,
  }

  try {
    if (selectedMember.value.attendance_id)
      await attendanceStore.updateAttendance(selectedMember.value.attendance_id, form)
    else await attendanceStore.addAttendance(form)

    toast.add({ severity: 'success', summary: 'Absensi berhasil disimpan.', life: 3000 })
    showModal.value = false
    await fetchData()
  } catch (e) {
    console.error(e)
    toast.add({ severity: 'error', summary: 'Gagal menyimpan absensi.', life: 3000 })
  } finally {
    saving.value = false
  }
}

// QR SCANNER
function openQRScanner() {
  if (!selectedSchedule.value) {
    uiStore.showToast('error', 'Silakan pilih jadwal latihan terlebih dahulu.')
    return
  }
  showQRScanner.value = true
  qrError.value = ''
  scanResult.value = null
}

function closeQRScanner() {
  showQRScanner.value = false
  qrError.value = ''
  scanResult.value = null
}

async function onQRCodeDetected(detectedCodes) {
  if (detectedCodes.length === 0) return
  const detectedCode = detectedCodes[0]
  const rawValue = detectedCode.rawValue

  if (!rawValue) {
    qrError.value = 'QR Code tidak valid'
    return
  }

  scanLoading.value = true
  qrError.value = ''

  try {
    await processQRCode(rawValue)
  } catch (error) {
    console.error('Error processing QR code:', error)
    qrError.value = 'Gagal memproses QR Code: ' + error.message
  } finally {
    scanLoading.value = false
  }
}

async function processQRCode(qrData) {
  try {
    if (!isValidBase64(qrData)) {
      qrError.value = 'Format QR Code tidak valid'
      return
    }

    const result = await attendanceStore.scanQRAttendance(qrData, selectedSchedule.value)

    scanResult.value = {
      success: true,
      message: result.message,
      memberName: result.data.member?.name || 'Unknown Member',
    }

    // Auto close setelah 2 detik
    setTimeout(() => {
      closeQRScanner()
      fetchData()
    }, 2000)
  } catch (error) {
    scanResult.value = {
      success: false,
      message: error.response?.data?.message || 'Gagal melakukan absensi',
    }
  }
}

function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}

function onCameraError(error) {
  console.error('Camera error:', error)
  if (error.name === 'NotAllowedError') {
    qrError.value = 'Akses kamera ditolak. Silakan izinkan akses kamera.'
  } else if (error.name === 'NotFoundError') {
    qrError.value = 'Kamera tidak ditemukan.'
  } else if (error.name === 'NotSupportedError') {
    qrError.value = 'Browser tidak mendukung akses kamera.'
  } else if (error.name === 'NotReadableError') {
    qrError.value = 'Kamera sedang digunakan oleh aplikasi lain.'
  } else {
    qrError.value = 'Terjadi error pada kamera: ' + error.message
  }
}

function onCameraInit(promise) {
  promise
    .then(() => {
      cameraPermission.value = 'granted'
      qrError.value = ''
    })
    .catch((error) => {
      onCameraError(error)
      cameraPermission.value = 'denied'
    })
}

async function fetchData() {
  training.value = trainingStore.datas
  member.value = memberStore.datas.filter((member) => member.status === 'active')
  attendance.value = attendanceStore.datas
}

onMounted(async () => {
  loading.value = true
  await Promise.all([trainingStore.get(), memberStore.getByParentId(), attendanceStore.get()])
  fetchData()
  loading.value = false
})
</script>

<template>
  <CoachLayouts>
    <div class="py-3 space-y-3">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow px-5 py-4 gap-4"
      >
        <button
          @click="openQRScanner"
          :disabled="!selectedSchedule"
          class="flex items-center gap-2 bg-piper-600 hover:bg-piper-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50 shadow cursor-pointer"
        >
          <i class="pi pi-qrcode"></i>
          <span>Scan QR Code</span>
        </button>

        <div class="relative w-full md:w-48">
          <input
            v-model="filters['global'].value"
            type="text"
            placeholder="Cari..."
            class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-0 shadow-lg w-full"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <i class="pi pi-search"></i>
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow px-5 py-4">
        <h3 class="font-semibold text-gray-700 mb-3">Pilih Jadwal Latihan</h3>
        <div
          v-if="schedules.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          <div
            v-for="s in schedules"
            :key="s.value"
            @click="selectedSchedule = s.value"
            class="cursor-pointer rounded-lg border shadow-sm p-3 text-center text-sm transition-all"
            :class="[
              selectedSchedule === s.value
                ? 'bg-piper-600 text-white border-piper-600 shadow-md'
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700',
            ]"
          >
            <p class="font-medium">{{ s.label }}</p>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          <i class="pi pi-calendar-times text-2xl mb-2"></i>
          <p>Tidak ada jadwal latihan yang akan datang</p>
        </div>
      </div>

      <!-- TABLE -->
      <div v-if="selectedSchedule" class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
          :value="datas"
          v-model:filters="filters"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          stripedRows
          removableSort
          class="p-datatable-sm"
          :pt="{
            thead: { class: 'text-sm font-light' },
            tbody: { class: 'text-sm font-light' },
            pcPaginator: { content: { class: 'text-xs' } },
          }"
        >
          <Column field="name" header="Nama" />

          <Column
            field="ku"
            header="KU"
            class="w-20"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{ calculateAgeGroup(data.date_of_birth) }}
              </p>
            </template>
          </Column>

          <Column
            field="gender"
            header="Jenis Kelamin"
            class="w-40 text-center"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <p class="text-center">{{ data.gender }}</p>
            </template>
          </Column>

          <Column
            field="status"
            header="Status"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <div
                class="text-center rounded-lg px-3 py-1 w-min mx-auto whitespace-nowrap border shadow-lg text-xs"
                :class="[
                  data.status === 'Hadir'
                    ? 'bg-green-300 text-green-800 border-green-800'
                    : data.status === 'Tidak Hadir'
                      ? 'bg-red-300 text-red-800 border-red-800'
                      : 'bg-gray-200 text-gray-800 border-gray-800',
                ]"
              >
                <p>{{ data.status }}</p>
              </div>
            </template>
          </Column>

          <Column
            field="reason"
            header="Alasan"
            class="w-48 text-center"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <p class="truncate block max-w-xs text-center" :title="data.reason">
                {{ data.reason || '-' }}
              </p>
            </template>
          </Column>

          <Column field="action" header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="openAttendanceModal(data)"
                  v-tooltip.left="{
                    value: data.status === 'Belum Absen' ? 'Absen' : 'Ubah',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  :class="[
                    'text-xs rounded-md px-3 py-1.5 font-medium transition-all cursor-pointer',
                    data.status === 'Belum Absen'
                      ? 'bg-piper-600 text-white hover:bg-piper-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  ]"
                >
                  {{ data.status === 'Belum Absen' ? 'Absen' : 'Ubah' }}
                </button>
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8 text-gray-500">
              <i class="pi pi-users" style="font-size: 2rem; margin-bottom: 0.5rem"></i>
              <p>Tidak ada data anggota aktif</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center text-sm py-6">
              <p>Mohon Tunggu, Sedang Memuat Data.......</p>
            </div>
          </template>
        </DataTable>
      </div>

      <div v-else class="bg-white rounded-lg shadow px-5 py-8 text-center">
        <i class="pi pi-info-circle text-2xl text-gray-400 mb-2"></i>
        <p class="text-gray-500">Silakan pilih jadwal latihan untuk melihat data absensi</p>
      </div>

      <!-- MODAL ABSENSI -->
      <Dialog
        v-model:visible="showModal"
        :header="selectedMember ? `Absen: ${selectedMember.name}` : 'Absen Manual'"
        modal
        class="w-full max-w-md"
      >
        <form @submit.prevent="saveManualAttendance">
          <div v-if="selectedMember" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p class="text-blue-700">
                <span class="font-medium">Status saat ini:</span>
                <span
                  :class="[
                    'ml-1 font-medium',
                    selectedMember.status === 'Hadir'
                      ? 'text-green-600'
                      : selectedMember.status === 'Tidak Hadir'
                        ? 'text-red-600'
                        : 'text-gray-600',
                  ]"
                >
                  {{ selectedMember.status }}
                </span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran</label>
              <select
                v-model="formStatus"
                class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500 cursor-pointer"
                :disabled="saving"
              >
                <option value="present">Hadir</option>
                <option value="absent">Tidak Hadir</option>
              </select>
            </div>

            <div v-if="formStatus === 'absent'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
              <textarea
                v-model="formReason"
                rows="3"
                placeholder="Masukkan alasan ketidakhadiran..."
                class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500"
                :disabled="saving"
                required
              ></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button
                @click="showModal = false"
                class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving || (formStatus === 'absent' && !formReason.trim())"
                class="px-4 py-2 text-sm rounded-lg bg-piper-600 text-white hover:bg-piper-700 flex items-center gap-2 cursor-pointer"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
                {{ saving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </form>
      </Dialog>

      <!-- MODAL QR SCANNER -->
      <Dialog
        v-model:visible="showQRScanner"
        header="Scan QR Code Absensi"
        :modal="true"
        :closable="!scanLoading"
        class="w-full max-w-2xl"
      >
        <div class="space-y-4">
          <!-- Camera Error Message -->
          <div v-if="qrError && !scanResult" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-red-500" style="font-size: 1.2rem"></i>
              <p class="text-red-700 text-sm">{{ qrError }}</p>
            </div>
          </div>

          <!-- Scan Result -->
          <div
            v-if="scanResult"
            :class="[
              'border rounded-lg p-4',
              scanResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
            ]"
          >
            <div class="flex items-center gap-2">
              <i
                :class="[
                  scanResult.success
                    ? 'pi pi-check-circle text-green-500'
                    : 'pi pi-exclamation-circle text-red-500',
                  'text-xl',
                ]"
              ></i>
              <div>
                <p :class="['font-medium', scanResult.success ? 'text-green-800' : 'text-red-800']">
                  {{ scanResult.message }}
                </p>
                <p v-if="scanResult.memberName" class="text-sm text-green-600 mt-1">
                  Member: <strong>{{ scanResult.memberName }}</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- QR Scanner -->
          <div v-if="!scanResult" class="relative">
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50"
            >
              <qrcode-stream
                v-if="showQRScanner && !scanLoading"
                @detect="onQRCodeDetected"
                @error="onCameraError"
                @init="onCameraInit"
                :camera="cameraPermission === 'denied' ? 'off' : 'auto'"
                class="w-full h-64 md:h-96"
              >
                <div
                  v-if="scanLoading"
                  class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                  <div class="text-white text-center">
                    <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
                    <p>Memproses QR Code...</p>
                  </div>
                </div>
              </qrcode-stream>

              <!-- Camera Placeholder jika error -->
              <div
                v-if="cameraPermission === 'denied'"
                class="h-64 md:h-96 flex items-center justify-center flex-col gap-3"
              >
                <i class="pi pi-video text-4xl text-gray-400"></i>
                <p class="text-gray-500 text-center px-4">
                  Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.
                </p>
                <button
                  @click="closeQRScanner"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <i class="pi pi-info-circle"></i> Petunjuk Scan QR
            </h3>
            <ul class="text-blue-700 text-sm space-y-1">
              <li>• Pastikan QR Code berada dalam area kotak scanner</li>
              <li>• Pastikan pencahayaan cukup</li>
              <li>• Jaga jarak yang tepat dari kamera</li>
              <li>• Absensi otomatis tersimpan ketika QR terdeteksi</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-2 pt-2">
            <button
              @click="closeQRScanner"
              :disabled="scanLoading"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tutup
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  </CoachLayouts>
</template>
