import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from './response'
import router from '@/router'

export const useBillStore = defineStore('bill', {
  state: () => ({
    datas: [],
    data: {},
  }),
  actions: {
    async getByParentId(withRelations = '') {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get(
          '/getByAuth/bill' + (withRelations ? `?with=${withRelations}` : ''),
        )
        this.datas = response.data.data
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
      } finally {
        uiStore.isLoading = false
      }
    },
    async post(form) {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      const responseStore = useResponseStore()

      try {
        const response = await api.post('/bill', form)
        responseStore.addSuccess(response.data.message)
        router.push({
          name: 'payment.show',
          params: {
            id: response.data.data.id,
          },
        })
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
        const errors = error.response.data?.errors
        Object.values(errors).forEach((fieldErrors) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((err) => responseStore.addError(err))
          }
        })
      } finally {
        uiStore.isLoading = false
      }
    },
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBillStore, import.meta.hot))
}
