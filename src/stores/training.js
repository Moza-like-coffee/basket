import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from '@/stores/response'

export const useTrainingStore = defineStore('training', {
  state: () => ({
    schedules: [],
    currentSchedule: null,
  }),

  getters: {
    formattedSchedules: (state) => {
      return state.schedules.map((schedule) => ({
        ...schedule,
        displayText: `${schedule.title} - ${new Date(schedule.date).toLocaleDateString('id-ID')}`,
      }))
    },
  },

  actions: {
    async fetchSchedules() {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const res = await api.get('/training/schedule')
        this.schedules = res.data
      } catch (error) {
        console.error('Gagal mengambil jadwal latihan:', error)
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },

    async create(form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const res = await api.post('/training/schedule', form)
        responseStore.addSuccess('Jadwal latihan berhasil ditambahkan!')
        await this.fetchSchedules()
        return res.data
      } catch (error) {
        console.error('Gagal menambah jadwal:', error)
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          responseStore.addError(errors.join(', '))
        } else {
          responseStore.addError('Gagal menambah jadwal latihan')
        }
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async update(id, form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const res = await api.put(`/training/schedule/${id}`, form)
        responseStore.addSuccess('Jadwal latihan berhasil diupdate!')
        await this.fetchSchedules()
        return res.data
      } catch (error) {
        console.error('Gagal mengupdate jadwal:', error)
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          responseStore.addError(errors.join(', '))
        } else {
          responseStore.addError('Gagal mengupdate jadwal latihan')
        }
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async destroy(id) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        await api.delete(`/training/schedule/${id}`)
        responseStore.addSuccess('Jadwal latihan berhasil dihapus!')
        await this.fetchSchedules()
      } catch (error) {
        console.error('Gagal menghapus jadwal:', error)
        responseStore.addError('Gagal menghapus jadwal latihan')
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    setCurrentSchedule(schedule) {
      this.currentSchedule = schedule
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTrainingStore, import.meta.hot))
}
