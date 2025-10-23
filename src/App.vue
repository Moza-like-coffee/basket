<script setup>
import { Toast, useToast } from 'primevue'
import { useResponseStore } from './stores/response'
import { useUIStore } from './stores/ui'
import { Transition, watch } from 'vue'
import ProgressBar from './components/ProgressBar.vue'

const ui = useUIStore()
const responseStore = useResponseStore()
const toast = useToast()

watch(
  () => responseStore.errors,
  (errors) => {
    if (errors.length > 0) {
      errors.forEach((msg) => {
        toast.add({ severity: 'error', summary: msg, life: 3000 })
      })
      responseStore.clearErrors()
    }
  },
)

watch(
  () => responseStore.success,
  (success) => {
    if (success.length > 0) {
      success.forEach((msg) => {
        toast.add({ severity: 'success', summary: msg, life: 3000 })
      })
      responseStore.clearSuccess()
    }
  },
)
</script>

<template>
  <div>
    <Toast
      :pt="{
        buttonContainer: {
          class: '!w-[28px] !h-[28px] !flex !items-center !justify-center',
        },
        closeButton: {
          class: '!my-auto',
        },
        messageContent: {
          class: '!items-center',
        },
      }"
    />
    <ProgressBar :isLoading="ui.isLoading" :mode="'indeterminate'" :value="ui.loadingValue" />
    <router-view :key="$route.fullPath" v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>
