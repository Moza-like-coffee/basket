import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from './response'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    datas: [],
    data: {},
  }),
  actions: {
    async getAll(withRelations = '') {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get(
          '/users' + (withRelations ? `?with=${withRelations}` : ''),
        )
        this.datas = response.data.data
      } catch (error) {
        console.log('Error getting users:', error)
        if (error.response && error.response.status !== 422) throw error
      } finally {
        uiStore.isLoading = false
      }
    },
    async getById(id, withRelations = '') {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get(
          '/users/' + id + (withRelations ? `?with=${withRelations}` : ''),
        )
        this.data = response.data.data
      } catch (error) {
        console.log('Error getting user by id:', error)
        if (error.response && error.response.status !== 422) throw error
      } finally {
        uiStore.isLoading = false
      }
    },
    async create(form) {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      const responseStore = useResponseStore()

      try {
        console.log('Sending form data:', form)
        const response = await api.post('/users', form)
        console.log('Response received:', response)
        
        responseStore.addSuccess(response.data.message)
        router.push({ name: 'admin.user.index' })
      } catch (error) {
        console.log('Error creating user:', error)
        
        // Handle 422 validation errors
        if (error.response && error.response.status === 422) {
          const errors = error.response.data?.errors
          if (errors) {
            Object.values(errors).forEach((fieldErrors) => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((err) => responseStore.addError(err))
              }
            })
          }
        } 
        // Handle other errors
        else if (error.response) {
          const message = error.response.data?.message || 'Terjadi kesalahan saat membuat user'
          responseStore.addError(message)
          console.error('Server error details:', error.response.data)
        } 
        // Handle network errors
        else {
          responseStore.addError('Network error: Tidak dapat terhubung ke server')
        }
        
        // Re-throw error for component to handle if needed
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },
    async update(form, id) {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      const responseStore = useResponseStore()

      try {
        const response = await api.put('/users/' + id, form)
        responseStore.addSuccess(response.data.message)
        router.push({ name: 'admin.user.index' })
      } catch (error) {
        console.log('Error updating user:', error)
        if (error.response && error.response.status === 422) {
          const errors = error.response.data?.errors
          if (errors) {
            Object.values(errors).forEach((fieldErrors) => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((err) => responseStore.addError(err))
              }
            })
          }
        } else if (error.response) {
          responseStore.addError(error.response.data?.message || 'Terjadi kesalahan saat mengupdate user')
        } else {
          responseStore.addError('Network error: Tidak dapat terhubung ke server')
        }
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },
    async destroy(id) {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      const responseStore = useResponseStore()

      try {
        const response = await api.delete('/users/' + id)
        responseStore.addSuccess(response.data.message)
        this.datas = this.datas.filter((data) => data.id !== id)
      } catch (error) {
        console.log('Error deleting user:', error)
        if (error.response && error.response.status === 422) {
          const errors = error.response.data?.errors
          if (errors) {
            Object.values(errors).forEach((fieldErrors) => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((err) => responseStore.addError(err))
              }
            })
          }
        } else if (error.response) {
          responseStore.addError(error.response.data?.message || 'Terjadi kesalahan saat menghapus user')
        } else {
          responseStore.addError('Network error: Tidak dapat terhubung ke server')
        }
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}