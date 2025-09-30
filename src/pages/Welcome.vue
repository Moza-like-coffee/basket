<script setup>
import Layouts from '@/layouts/Layouts.vue'
import heroImage from '@/assets/images/hero.jpg'
</script>
<template>
  <Layouts>
    <div>
      <div class="bg-piper-600 w-full h-16">
        <div class="h-full w-full flex justify-end items-center px-10">
          <div>
            <input
              class="rounded-lg bg-white px-2 py-1 border border-gray-400 shadow-lg text-sm"
              type="text"
              placeholder="Cari...."
            />
          </div>
        </div>
      </div>
      <div class="bg-gray-500 h-[calc(100vh-128px)] relative z-10">
        <img :src="heroImage" alt="" class="absolute w-full h-full object-cover" />
        <div
          class="absolute z-20 h-full w-1/2 bg-gradient-to-r from-white/70 from-80% backdrop-blur-sm px-10"
        >
          <div class="h-full flex flex-col items-start justify-center gap-3">
            <p class="text-4xl font-bold font-basketball">Let's Play Basketball</p>
            <p class="text-xs font-medium">
              Bukan sekedar perkumpulan bola basket biasa, dan tidak hanya sekedar bermain basket,
              kami merupakan komunitas olahraga basket milik bersama setiap insan keluarga besar
              Victoria, untuk menyalurkan bakat dan minat nya serta bersosialisasi dalam semangat
              kekeluargaan dan sportifitas
            </p>
            <router-link
              :to="{ name: 'register' }"
              class="bg-piper-600 px-5 shadow-lg py-2 rounded-lg text-white font-medium uppercase"
            >
              Bergabung Sekarang
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Layouts>
</template>
