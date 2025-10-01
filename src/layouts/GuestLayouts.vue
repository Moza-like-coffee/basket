<script setup>
import lottieAsset from '@/assets/lottie/basketball-player.lottie'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<template>
  <div>
    <p class="text-black bg-white"></p>
    <div class="h-screen w-full bg-noise flex items-center justify-center p-5">
      <div
        class="w-full max-w-3xl min-h-20 bg-rhino-50 border-rhino-950/20 border rounded-xl shadow-lg flex gap-5 p-2"
      >
        <div
          :class="route?.name == 'register' ? 'w-[50%]' : 'w-[55%]'"
          class="flex-none flex items-center justify-center rounded-xl border border-black bg-hexagon"
        >
          <DotLottieVue class="aspect-square" autoplay loop :src="lottieAsset" />
        </div>
        <div class="w-full">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
