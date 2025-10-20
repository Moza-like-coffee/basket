import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from '@/stores/response'

export const useAttendanceStore = defineStore('attendance', {
  state: () => ({
    attendances: [],
    filters: {
      schedule: '',
      date: '',
      status: ''
    }
  }),

  getters: {
    filteredAttendances: (state) => {
      return state.attendances.filter(attendance => {
        let matches = true

        if (state.filters.schedule) {
          matches = matches && attendance.training_schedule_id === state.filters.schedule
        }

        if (state.filters.date) {
          matches = matches && attendance.date === state.filters.date
        }

        if (state.filters.status) {
          matches = matches && attendance.status === state.filters.status
        }

        return matches
      })
    }
  },

  actions: {
    async fetchAttendances(params = {}) {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const queryParams = new URLSearchParams()
        queryParams.append('with', 'member')
        queryParams.append('with', 'trainingSchedule')
        queryParams.append('with', 'coach')

        if (params.schedule) queryParams.append('training_schedule_id', params.schedule)
        if (params.date) queryParams.append('date', params.date)
        if (params.status) queryParams.append('status', params.status)

        const res = await api.get(`/attendance?${queryParams.toString()}`)
        this.attendances = res.data
      } catch (error) {
        console.error('Gagal mengambil data absensi:', error)
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },

    async addAttendance(form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const res = await api.post('/attendance', form)
        responseStore.addSuccess('Absensi berhasil ditambahkan!')
        await this.fetchAttendances()
        return res.data
      } catch (error) {
        console.error('Gagal menambah absensi:', error)
        const msg = error.response?.data?.message || 'Gagal menambah absensi'
        responseStore.addError(msg)
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async scanAttendance(form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const res = await api.post('/attendance/scan', form)
        responseStore.addSuccess('Absensi melalui scan berhasil!')
        await this.fetchAttendances()
        return res.data
      } catch (error) {
        console.error('Gagal scan absensi:', error)
        const msg = error.response?.data?.message || 'Gagal melakukan absensi melalui scan'
        responseStore.addError(msg)
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async updateAttendance(id, form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const res = await api.put(`/attendance/${id}`, form)
        responseStore.addSuccess('Data absensi berhasil diperbarui!')
        await this.fetchAttendances()
        return res.data
      } catch (error) {
        console.error('Gagal update absensi:', error)
        const msg = error.response?.data?.message || 'Gagal memperbarui data absensi'
        responseStore.addError(msg)
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async deleteAttendance(id) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        await api.delete(`/attendance/${id}`)
        responseStore.addSuccess('Absensi berhasil dihapus!')
        await this.fetchAttendances()
      } catch (error) {
        console.error('Gagal menghapus absensi:', error)
        const msg = error.response?.data?.message || 'Gagal menghapus data absensi'
        responseStore.addError(msg)
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        schedule: '',
        date: '',
        status: ''
      }
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAttendanceStore, import.meta.hot))
}
