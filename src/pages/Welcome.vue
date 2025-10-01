<script setup>
import Layouts from '@/layouts/Layouts.vue'
import heroImage from '@/assets/images/hero.jpg'
import spot1 from '@/assets/path/spot-1.svg'
import spot2 from '@/assets/path/spot-2.svg'
import spot3 from '@/assets/path/spot-3.svg'
</script>
<template>
  <Layouts>
    <!-- Section 1 -->
    <div>
      <div class="bg-piper-600 w-full h-16">
        <div class="h-full w-full flex md:justify-end justify-center items-center gap-3 px-10">
          <div class="flex gap-1 justify-center items-center">
            <svg
              class="fill-white w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                ></path>
                <path
                  d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                ></path>
              </g>
            </svg>
            <svg viewBox="0 0 24 24" class="fill-white w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.7828 3.91825C20.1313 3.83565 20.3743 3.75444 20.5734 3.66915C20.8524 3.54961 21.0837 3.40641 21.4492 3.16524C21.7563 2.96255 22.1499 2.9449 22.4739 3.11928C22.7979 3.29366 23 3.6319 23 3.99986C23 5.08079 22.8653 5.96673 22.5535 6.7464C22.2911 7.40221 21.9225 7.93487 21.4816 8.41968C21.2954 11.7828 20.3219 14.4239 18.8336 16.4248C17.291 18.4987 15.2386 19.8268 13.0751 20.5706C10.9179 21.3121 8.63863 21.4778 6.5967 21.2267C4.56816 20.9773 2.69304 20.3057 1.38605 19.2892C1.02813 19.0108 0.902313 18.5264 1.07951 18.109C1.25671 17.6916 1.69256 17.4457 2.14144 17.5099C3.42741 17.6936 4.6653 17.4012 5.6832 16.9832C5.48282 16.8742 5.29389 16.7562 5.11828 16.6346C4.19075 15.9925 3.4424 15.1208 3.10557 14.4471C2.96618 14.1684 2.96474 13.8405 3.10168 13.5606C3.17232 13.4161 3.27562 13.293 3.40104 13.1991C2.04677 12.0814 1.49999 10.5355 1.49999 9.49986C1.49999 9.19192 1.64187 8.90115 1.88459 8.71165C1.98665 8.63197 2.10175 8.57392 2.22308 8.53896C2.12174 8.24222 2.0431 7.94241 1.98316 7.65216C1.71739 6.3653 1.74098 4.91284 2.02985 3.75733C2.1287 3.36191 2.45764 3.06606 2.86129 3.00952C3.26493 2.95299 3.6625 3.14709 3.86618 3.50014C4.94369 5.36782 6.93116 6.50943 8.78086 7.18568C9.6505 7.50362 10.4559 7.70622 11.0596 7.83078C11.1899 6.61019 11.5307 5.6036 12.0538 4.80411C12.7439 3.74932 13.7064 3.12525 14.74 2.84698C16.5227 2.36708 18.5008 2.91382 19.7828 3.91825ZM10.7484 9.80845C10.0633 9.67087 9.12171 9.43976 8.09412 9.06408C6.7369 8.56789 5.16088 7.79418 3.84072 6.59571C3.86435 6.81625 3.89789 7.03492 3.94183 7.24766C4.16308 8.31899 4.5742 8.91899 4.94721 9.10549C5.40342 9.3336 5.61484 9.8685 5.43787 10.3469C5.19827 10.9946 4.56809 11.0477 3.99551 10.9046C4.45603 11.595 5.28377 12.2834 6.66439 12.5135C7.14057 12.5929 7.49208 13.0011 7.49986 13.4838C7.50765 13.9665 7.16949 14.3858 6.69611 14.4805L5.82565 14.6546C5.95881 14.7703 6.103 14.8838 6.2567 14.9902C6.95362 15.4727 7.65336 15.6808 8.25746 15.5298C8.70991 15.4167 9.18047 15.6313 9.39163 16.0472C9.60278 16.463 9.49846 16.9696 9.14018 17.2681C8.49626 17.8041 7.74425 18.2342 6.99057 18.5911C6.63675 18.7587 6.24134 18.9241 5.8119 19.0697C6.14218 19.1402 6.48586 19.198 6.84078 19.2417C8.61136 19.4594 10.5821 19.3126 12.4249 18.6792C14.2614 18.0479 15.9589 16.9385 17.2289 15.2312C18.497 13.5262 19.382 11.1667 19.5007 7.96291C19.51 7.71067 19.6144 7.47129 19.7929 7.29281C20.2425 6.84316 20.6141 6.32777 20.7969 5.7143C20.477 5.81403 20.1168 5.90035 19.6878 5.98237C19.3623 6.04459 19.0272 5.94156 18.7929 5.70727C18.0284 4.94274 16.5164 4.43998 15.2599 4.77822C14.6686 4.93741 14.1311 5.28203 13.7274 5.89906C13.3153 6.52904 13 7.51045 13 8.9999C13 9.28288 12.8801 9.5526 12.6701 9.74221C12.1721 10.1917 11.334 9.92603 10.7484 9.80845Z"
                ></path>
              </g>
            </svg>
            <svg
              class="fill-white w-5 h-5"
              viewBox="-5 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g id="SVGRepo_iconCarrier">
                <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-385.000000, -7399.000000)">
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M335.821282,7259 L335.821282,7250 L338.553693,7250 L339,7246 L335.821282,7246 L335.821282,7244.052 C335.821282,7243.022 335.847593,7242 337.286884,7242 L338.744689,7242 L338.744689,7239.14 C338.744689,7239.097 337.492497,7239 336.225687,7239 C333.580004,7239 331.923407,7240.657 331.923407,7243.7 L331.923407,7246 L329,7246 L329,7250 L331.923407,7250 L331.923407,7259 L335.821282,7259 Z"
                        id="facebook-[#176]"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <svg viewBox="0 0 24 24" class="fill-white w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.49614 7.13176C9.18664 6.9549 8.80639 6.95617 8.49807 7.13509C8.18976 7.31401 8 7.64353 8 8V16C8 16.3565 8.18976 16.686 8.49807 16.8649C8.80639 17.0438 9.18664 17.0451 9.49614 16.8682L16.4961 12.8682C16.8077 12.6902 17 12.3589 17 12C17 11.6411 16.8077 11.3098 16.4961 11.1318L9.49614 7.13176ZM13.9844 12L10 14.2768V9.72318L13.9844 12Z"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 12C0 8.25027 0 6.3754 0.954915 5.06107C1.26331 4.6366 1.6366 4.26331 2.06107 3.95491C3.3754 3 5.25027 3 9 3H15C18.7497 3 20.6246 3 21.9389 3.95491C22.3634 4.26331 22.7367 4.6366 23.0451 5.06107C24 6.3754 24 8.25027 24 12C24 15.7497 24 17.6246 23.0451 18.9389C22.7367 19.3634 22.3634 19.7367 21.9389 20.0451C20.6246 21 18.7497 21 15 21H9C5.25027 21 3.3754 21 2.06107 20.0451C1.6366 19.7367 1.26331 19.3634 0.954915 18.9389C0 17.6246 0 15.7497 0 12ZM9 5H15C16.9194 5 18.1983 5.00275 19.1673 5.10773C20.0989 5.20866 20.504 5.38448 20.7634 5.57295C21.018 5.75799 21.242 5.98196 21.4271 6.23664C21.6155 6.49605 21.7913 6.90113 21.8923 7.83269C21.9973 8.80167 22 10.0806 22 12C22 13.9194 21.9973 15.1983 21.8923 16.1673C21.7913 17.0989 21.6155 17.504 21.4271 17.7634C21.242 18.018 21.018 18.242 20.7634 18.4271C20.504 18.6155 20.0989 18.7913 19.1673 18.8923C18.1983 18.9973 16.9194 19 15 19H9C7.08058 19 5.80167 18.9973 4.83269 18.8923C3.90113 18.7913 3.49605 18.6155 3.23664 18.4271C2.98196 18.242 2.75799 18.018 2.57295 17.7634C2.38448 17.504 2.20866 17.0989 2.10773 16.1673C2.00275 15.1983 2 13.9194 2 12C2 10.0806 2.00275 8.80167 2.10773 7.83269C2.20866 6.90113 2.38448 6.49605 2.57295 6.23664C2.75799 5.98196 2.98196 5.75799 3.23664 5.57295C3.49605 5.38448 3.90113 5.20866 4.83269 5.10773C5.80167 5.00275 7.08058 5 9 5Z"
                ></path>
              </g>
            </svg>
          </div>
          <div>
            <div class="flex bg-white border border-gray-400 shadow-lg rounded-lg overflow-hidden">
              <div class="flex items-center justify-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  class="w-5 stroke-gray-400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>
              <input
                class="bg-white text-black px-2 py-1 text-sm focus:outline-0"
                type="text"
                placeholder="Cari...."
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-500 h-[calc(100vh-128px)] relative z-10">
        <img :src="heroImage" alt="" class="absolute w-full h-full object-cover" />
        <div
          class="absolute z-20 md:h-full top-1/2 md:translate-y-0 -translate-y-1/2 md:top-0 md:py-0 py-10 md:rounded-none rounded-lg md:w-1/2 w-[90%] md:left-0 left-[5%] bg-gradient-to-r from-white/70 from-80% backdrop-blur-sm px-10"
        >
          <div class="h-full flex flex-col items-start justify-center gap-3 text-black">
            <p class="text-4xl font-bold font-basketball">Let's Play Basketball</p>
            <p class="text-xs font-medium font-basketball">
              Bukan sekedar perkumpulan bola basket biasa, dan tidak hanya sekedar bermain basket,
              kami merupakan komunitas olahraga basket milik bersama setiap insan keluarga besar
              Victoria, untuk menyalurkan bakat dan minat nya serta bersosialisasi dalam semangat
              kekeluargaan dan sportifitas
            </p>
            <router-link
              :to="{ name: 'register' }"
              class="bg-piper-600 px-5 shadow-lg py-2 rounded-lg text-white font-medium uppercase font-basketball"
            >
              Bergabung Sekarang
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Section 2 -->
    <div class="w-full md:h-[calc(100vh-64px)] bg-noise relative z-10">
      <img :src="spot1" alt="" class="absolute z-20 top-0 right-0 w-60" />
      <img :src="spot2" alt="" class="absolute z-20 bottom-0 right-0 w-60" />
      <div class="w-full grid md:grid-cols-2 grid-cols-1 gap-10 p-10 relative z-30 h-full">
        <div class="relative order-2 md:order-1">
          <img :src="spot3" alt="" class="absolute z-20 bottom-0 right-0 w-full opacity-20" />
          <div class="grid grid-cols-2 grid-rows-2 md:gap-10 gap-5 h-full relative z-20">
            <div v-for="(item, index) in 4" :key="index" class="relative z-30">
              <img
                class="rounded-lg h-full w-full object-cover"
                src="https://asset.kompas.com/crops/B944QqBLOcgRw4IokyR_Ll41uiQ=/0x0:4732x3155/1200x800/data/photo/2024/06/11/66687618bb34e.jpeg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="order-1 md:order-2 flex justify-center flex-col h-full text-black">
          <p class="font-poppins font-bold md:text-4xl text-2xl">
            Temui Sosok di Balik <br />
            <span class="text-piper-600">Transformasi</span> Bola Basket
          </p>
          <p class="font-basketball md:text-sm text-xs mt-5">
            Para pelatih juga selalu menekankan pentingnya disiplin, konsistensi, dan sportivitas.
            Bagi kami, kemenangan bukan hanya soal skor akhir, tetapi juga hasil dari proses
            panjang, kerja keras, serta dedikasi penuh. Melalui pendekatan yang menyenangkan namun
            serius, pelatih kami membantu setiap pemain menemukan potensi terbaiknya dan menjadikan
            basket sebagai bagian dari gaya hidup sehat dan inspiratif.
          </p>
        </div>
      </div>
    </div>

    <!-- Section 3 -->
    <div class="w-full md:h-[calc(100vh-64px)] bg-gray-100 relative z-10 p-10">
      <div class="md:flex block gap-5 items-center h-full">
        <div class="md:max-w-2/3 w-full space-y-3">
          <p class="font-poppins font-bold md:text-4xl text-2xl max-w-sm text-black">
            Kenapa Harus <span class="text-piper-600">Bergabung</span> Dengan Kami?
          </p>
          <div class="grid md:grid-cols-2 md:grid-rows-2 gap-5">
            <div class="bg-rhino-900 w-full h-24 rounded-lg px-5 py-3">
              <div class="flex gap-3 h-full">
                <div class="flex items-center h-full">
                  <div class="bg-white rounded-full p-2 shadow shadow-piper-100">
                    <svg viewBox="0 0 24 24" class="w-7 stroke-piper-600 fill-none">
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M12 17V9M16 13.0011L8 13M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-white font-basketball">
                    <span class="text-piper-600 font-bold">52</span> Tahun Pengalaman
                  </p>
                  <p class="text-xs text-gray-300">
                    Sejak 1972, kami konsisten membina dan mengembangkan bakat basket.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-rhino-900 w-full h-24 rounded-lg px-5 py-3">
              <div class="flex gap-3 h-full">
                <div class="flex items-center h-full">
                  <div class="bg-white rounded-full p-2 shadow shadow-piper-100">
                    <svg viewBox="0 0 32 32" class="w-7 fill-piper-600">
                      <g id="SVGRepo_iconCarrier">
                        <path
                          class="linesandangles_een"
                          d="M24,4H8C4.822,4,3,5.822,3,9c0,2.721,2.399,5.817,4.553,6.895l0.784,0.392 c0.894,2.99,3.492,5.246,6.663,5.644V24c0,1.105-0.895,2-2,2h-2v2h10v-2h-2c-1.105,0-2-0.895-2-2v-2.069 c3.171-0.398,5.769-2.654,6.663-5.644l0.784-0.392C26.601,14.817,29,11.721,29,9C29,5.822,27.178,4,24,4z M5,9c0-2.075,0.925-3,3-3 v7.83C6.427,12.79,5,10.56,5,9z M22,14c0,3.309-2.691,6-6,6s-6-2.691-6-6V6h12V14z M24,13.83V6c2.075,0,3,0.925,3,3 C27,10.56,25.573,12.79,24,13.83z M11,14h2c0,1.654,1.346,3,3,3v2C13.243,19,11,16.757,11,14z"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-white font-basketball">
                    <span class="text-piper-600 font-bold">76</span> Trofi
                  </p>
                  <p class="text-xs text-gray-300">
                    Pencapaian luar biasa hingga tahun 2023, bukti nyata kualitas pembinaan.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-rhino-900 w-full h-24 rounded-lg px-5 py-3">
              <div class="flex gap-3 h-full">
                <div class="flex items-center h-full">
                  <div class="bg-white rounded-full p-2 shadow shadow-piper-100">
                    <svg viewBox="0 0 16 16" class="w-7 fill-piper-600">
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.36066 4.98361H4.93443V7.86885H8.60656V9.44262H4.93443V13.1148H8.60656V14.6885H4.14754C3.71296 14.6885 3.36066 14.3362 3.36066 13.9016V4.98361Z"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1 1.83607C1 0.822034 1.82203 0 2.83607 0H10.7049C11.7189 0 12.541 0.822034 12.541 1.83607V3.67213C12.541 4.68616 11.7189 5.5082 10.7049 5.5082H2.83607C1.82203 5.5082 1 4.68616 1 3.67213V1.83607ZM2.83607 1.57377C2.6912 1.57377 2.57377 1.6912 2.57377 1.83607V3.67213C2.57377 3.81699 2.6912 3.93443 2.83607 3.93443H10.7049C10.8498 3.93443 10.9672 3.81699 10.9672 3.67213V1.83607C10.9672 1.6912 10.8498 1.57377 10.7049 1.57377H2.83607Z"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.81967 8.39344C7.81967 7.37941 8.64171 6.55738 9.65574 6.55738H12.2787C13.2927 6.55738 14.1148 7.37941 14.1148 8.39344V8.91803C14.1148 9.93206 13.2927 10.7541 12.2787 10.7541H9.65574C8.64171 10.7541 7.81967 9.93206 7.81967 8.91803V8.39344ZM9.65574 8.13115C9.51088 8.13115 9.39344 8.24858 9.39344 8.39344V8.91803C9.39344 9.06289 9.51088 9.18033 9.65574 9.18033H12.2787C12.4235 9.18033 12.541 9.06289 12.541 8.91803V8.39344C12.541 8.24858 12.4235 8.13115 12.2787 8.13115H9.65574Z"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.81967 13.6393C7.81967 12.6253 8.64171 11.8033 9.65574 11.8033H12.2787C13.2927 11.8033 14.1148 12.6253 14.1148 13.6393V14.1639C14.1148 15.178 13.2927 16 12.2787 16H9.65574C8.64171 16 7.81967 15.178 7.81967 14.1639V13.6393ZM9.65574 13.377C9.51088 13.377 9.39344 13.4945 9.39344 13.6393V14.1639C9.39344 14.3088 9.51088 14.4262 9.65574 14.4262H12.2787C12.4235 14.4262 12.541 14.3088 12.541 14.1639V13.6393C12.541 13.4945 12.4235 13.377 12.2787 13.377H9.65574Z"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-white font-basketball">
                    <span class="text-piper-600 font-bold">7</span> Kelas Pembinaan
                  </p>
                  <p class="text-xs text-gray-300">
                    Mulai dari U8 hingga Senior, sesuai jenjang usia dan kemampuan.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-rhino-900 w-full h-24 rounded-lg px-5 py-3">
              <div class="flex gap-3 h-full">
                <div class="flex items-center h-full">
                  <div class="bg-white rounded-full p-2 shadow shadow-piper-100">
                    <svg viewBox="0 0 197.667 197.667" class="w-7 fill-piper-600">
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M188.583,146.142v44.025c0,4.142-3.357,7.5-7.5,7.5h-164.5c-4.142,0-7.5-3.358-7.5-7.5v-44.025 c0-16.349,11.019-30.763,26.796-35.05l35.933-9.765c3.286-0.894,6.76,0.539,8.462,3.487l18.559,32.144l18.559-32.144 c1.702-2.948,5.18-4.378,8.462-3.487l35.933,9.765C177.564,115.379,188.583,129.792,188.583,146.142z M98.833,0 C77.722,0,60.547,20.479,60.547,45.652c0,25.172,17.175,45.652,38.287,45.652s38.286-20.479,38.286-45.652 C137.12,20.479,119.945,0,98.833,0z"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-white font-basketball">
                    <span class="text-piper-600 font-bold">12</span> Coaches
                  </p>
                  <p class="text-xs text-gray-300">
                    Didukung 7 pelatih senior dan 5 junior yang berpengalaman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full md:flex justify-center items-center py-5 hidden">
          <img
            class="rounded-full h-full aspect-square object-cover"
            src="https://d3i6fh83elv35t.cloudfront.net/static/2021/01/2021-01-04T004536Z_1887032542_MT1USATODAY15392993_RTRMADP_3_NCAA-BASKETBALL-OHIO-STATE-AT-MINNESOTA-1024x819.jpg"
            alt=""
          />
        </div>
      </div>
    </div>

    <!-- Section 4 -->
    <div class="w-full md:h-[calc(100vh-64px)] bg-noise relative z-10 p-10">
      <p
        class="text-center font-poppins font-bold md:text-4xl text-2xl text-black border-b-2 w-min mx-auto whitespace-nowrap border-piper-600"
      >
        Visi & <span class="text-piper-600">Misi</span>
      </p>
      <div class="grid md:grid-cols-3 mt-5 gap-5 h-full">
        <div class="space-y-5 h-full">
          <div class="flex flex-col items-center justify-center">
            <div class="rounded-full h-28 w-28 bg-rhino-900 flex items-center justify-center">
              <svg class="fill-white w-15 h-15" viewBox="0 0 40 40">
                <g id="SVGRepo_iconCarrier">
                  <g display="none">
                    <path
                      display="inline"
                      d="M20.01,36.5c-0.277,0-0.537-0.137-0.693-0.368L9.468,21.529c-1.171-1.861-1.79-3.993-1.79-6.162 C7.678,8.824,13.206,3.5,20,3.5c6.795,0,12.322,5.324,12.322,11.867c0,2.164-0.612,4.284-1.77,6.129l-9.851,14.636 C20.547,36.363,20.287,36.5,20.01,36.5L20.01,36.5z M20,5.17c-5.873,0-10.652,4.574-10.652,10.197c0,1.854,0.525,3.669,1.52,5.251 l9.14,13.55l9.146-13.581c0.981-1.566,1.499-3.371,1.499-5.22C30.652,9.744,25.873,5.17,20,5.17L20,5.17z"
                    ></path>
                    <path
                      display="inline"
                      d="M20,20.857c-3.159,0-5.728-2.482-5.728-5.535c0-3.051,2.569-5.534,5.728-5.534s5.729,2.483,5.729,5.534 C25.729,18.375,23.158,20.857,20,20.857L20,20.857z M20,11.458c-2.237,0-4.057,1.734-4.057,3.864c0,2.13,1.82,3.865,4.057,3.865 s4.058-1.734,4.058-3.865C24.058,13.192,22.236,11.458,20,11.458L20,11.458z"
                    ></path>
                  </g>
                  <path
                    display="none"
                    d="M36.705,34.289L26.059,23.615c3.918-4.69,3.688-11.708-0.707-16.114C23.1,5.243,20.104,4,16.919,4 S10.74,5.243,8.488,7.501c-4.647,4.66-4.647,12.241,0,16.899c2.253,2.257,5.248,3.5,8.431,3.5c2.866,0,5.573-1.015,7.728-2.86 l10.639,10.665C35.479,35.902,35.738,36,35.994,36s0.514-0.098,0.709-0.293C37.096,35.316,37.097,34.68,36.705,34.289z M9.766,23.126c-3.945-3.958-3.945-10.395,0-14.351c1.912-1.914,4.452-2.97,7.153-2.97s5.243,1.056,7.153,2.97 c3.946,3.956,3.946,10.394,0,14.351c-1.91,1.914-4.452,2.969-7.153,2.969S11.678,25.04,9.766,23.126z"
                  ></path>
                  <path
                    display="none"
                    d="M25.38,34.848c-0.066,0-0.136-0.009-0.206-0.024l-10.498-2.561l-10.61,2.561 c-0.069,0.016-0.139,0.024-0.205,0.024c-0.191,0-0.38-0.064-0.532-0.184C3.12,34.5,3,34.252,3,33.986V8.635 c0-0.397,0.27-0.741,0.657-0.836l10.76-2.623l0.407,0.003l10.504,2.558l10.607-2.561c0.065-0.016,0.135-0.023,0.203-0.023 c0.195,0,0.38,0.063,0.533,0.183C36.881,5.499,37,5.746,37,6.012v25.352c0,0.397-0.27,0.741-0.656,0.837l-10.759,2.622 C25.516,34.839,25.446,34.848,25.38,34.848L25.38,34.848z M15.481,30.688l9.039,2.203V9.311l-9.039-2.203V30.688z M26.24,9.311 v23.58l9.039-2.202V7.108L26.24,9.311z M4.721,9.311v23.58l9.039-2.202V7.108L4.721,9.311z"
                  ></path>
                  <g display="none">
                    <path
                      display="inline"
                      d="M9.708,35C7.112,35,5,32.893,5,30.303c0-2.592,2.112-4.699,4.708-4.699c2.595,0,4.707,2.107,4.707,4.699 C14.415,32.893,12.303,35,9.708,35L9.708,35z M9.708,27.445c-1.578,0-2.863,1.281-2.863,2.857c0,1.574,1.285,2.855,2.863,2.855 c1.578,0,2.861-1.281,2.861-2.855C12.568,28.727,11.285,27.445,9.708,27.445L9.708,27.445z"
                    ></path>
                    <path
                      display="inline"
                      d="M24.574,35c-0.621,0-1.125-0.505-1.125-1.126c0-9.552-7.771-17.324-17.323-17.324 C5.505,16.55,5,16.045,5,15.425s0.505-1.126,1.126-1.126c10.792,0,19.573,8.781,19.573,19.575C25.699,34.495,25.193,35,24.574,35 L24.574,35z"
                    ></path>
                    <path
                      display="inline"
                      d="M33.916,35c-0.597,0-1.082-0.486-1.082-1.084c0-14.75-12-26.751-26.751-26.751 C5.486,7.165,5,6.68,5,6.083C5,5.486,5.486,5,6.083,5C22.027,5,35,17.972,35,33.916C35,34.514,34.514,35,33.916,35L33.916,35z"
                    ></path>
                  </g>
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20,29.616c-6.911,0-13.412-3.681-17-9.615c3.588-5.935,10.089-9.617,17-9.617 c6.91,0,13.412,3.682,17,9.617C33.412,25.936,26.91,29.616,20,29.616L20,29.616z M19.998,12.254 c-5.817,0-11.309,2.848-14.687,7.618l-0.088,0.125l0.088,0.124c3.378,4.77,8.87,7.618,14.687,7.618 c5.82,0,11.311-2.849,14.687-7.618l0.089-0.124l-0.089-0.125C31.309,15.103,25.818,12.254,19.998,12.254L19.998,12.254z"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.987,13.521c-3.574,0-6.478,2.9-6.478,6.479c0,3.579,2.904,6.478,6.478,6.478 c3.581,0,6.478-2.898,6.478-6.478C26.465,16.42,23.568,13.521,19.987,13.521z M19.987,24.857c-2.68,0-4.858-2.175-4.858-4.858 s2.178-4.859,4.858-4.859c2.686,0,4.858,2.175,4.858,4.859S22.673,24.857,19.987,24.857z"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
            <p class="text-2xl text-piper-600 font-bold tracking-widest font-basketball">VISI</p>
          </div>
          <div class="bg-white w-full min-h-20 md:h-full md:max-h-52 rounded-lg shadow-lg p-5">
            <p class="text-gray-600 text-sm">
              Menjadikan pembinaan pemain muda dan usia dini sebagai fondasi utama dalam
              pengembangan basket. Kami percaya bahwa mencetak generasi penerus yang memiliki
              keterampilan, kedisiplinan, dan semangat sportivitas sejak awal merupakan langkah
              penting untuk menjaga keberlangsungan dan kemajuan olahraga ini.
            </p>
          </div>
        </div>
        <div class="space-y-5 h-full">
          <div class="flex flex-col items-center justify-center">
            <div class="rounded-full h-28 w-28 bg-rhino-900 flex items-center justify-center">
              <svg viewBox="0 0 32 32" class="stroke-white w-15 h-15">
                <g id="SVGRepo_iconCarrier">
                  <line class="fill-none stroke-2" x1="16" y1="16" x2="22" y2="10"></line>
                  <polygon
                    class="fill-none stroke-2"
                    points="30,6 26,6 26,2 22,6 22,10 26,10 "
                  ></polygon>
                  <circle class="fill-none stroke-2" cx="16" cy="16" r="6"></circle>
                  <path
                    class="fill-none stroke-2"
                    d="M27,9c1.3,2,2,4.4,2,7c0,7.2-5.8,13-13,13S3,23.2,3,16S8.8,3,16,3c2.6,0,5,0.7,7,2"
                  ></path>
                </g>
              </svg>
            </div>
            <p class="text-2xl text-piper-600 font-bold tracking-widest font-basketball">MISI</p>
          </div>
          <div class="bg-white w-full min-h-20 md:h-full md:max-h-52 rounded-lg shadow-lg p-5">
            <p class="text-gray-600 text-sm">
              Sejak tahun 1972, kami konsisten aktif berkompetisi di berbagai ajang dan terus
              berupaya menghadirkan prestasi demi prestasi. Semangat inilah yang menjadi misi kami
              untuk selalu menjaga eksistensi serta memberikan kontribusi nyata bagi perkembangan
              basket, tidak hanya untuk hari ini, tetapi juga untuk tahun-tahun mendatang.
            </p>
          </div>
        </div>
        <div class="space-y-5 h-full">
          <div class="flex flex-col items-center justify-center">
            <div class="rounded-full h-28 w-28 bg-rhino-900 flex items-center justify-center">
              <svg viewBox="0 0 64 64" class="fill-white w-15 h-15">
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M32 2C20.973 2 12 9.889 12 19.586c0 5.13 3.368 10.412 6.621 15.516c2.803 4.393 5.48 8.586 6.316 12.898h14.125c.838-4.313 3.512-8.506 6.314-12.898C48.631 29.998 52 24.716 52 19.586C52 9.889 43.027 2 32 2m0 27.674c1.932 2.085 3.752 2.705 4.584 2.889c-.125.555-.238 1.097-.369 1.631c-.246 1.092-.486 2.156-.719 3.178a723.122 723.122 0 0 0-1.895 8.629h-3.203a787.762 787.762 0 0 0-1.895-8.629l-.721-3.178c-.131-.534-.244-1.076-.367-1.631c.833-.184 2.653-.804 4.585-2.889m-.539-2.183c-.191-.413-.26-.835-.064-1.146c.164-.247.381-.388.604-.388s.438.141.604.388c.195.311.127.732-.064 1.146c-.141.292-.334.57-.541.839a4.66 4.66 0 0 1-.539-.839m12.23 6.534c-2.583 4.049-5.039 7.898-6.203 11.975h-3.246a801.908 801.908 0 0 0 2.113-8.465c.246-1.021.506-2.078.771-3.168c.148-.58.279-1.178.424-1.773c.756-.051 1.479-.287 2.043-.804c.578-.569.879-1.313.744-2.107c-.061-.38-.346-.872-.896-1.04a1.397 1.397 0 0 0-.832-.019a1.572 1.572 0 0 0-.598.396c-.533.592-.727 1.183-.945 1.769c-.102.295-.186.59-.266.881c0 0-.85.065-2.668-1.158c-1.01-.679-1.301-1.17-1.594-1.495c.316-.351.619-.736.854-1.203c.125-.261.23-.544.266-.862s-.023-.678-.205-.988a1.749 1.749 0 0 0-.865-.76c-.182-.065-.385-.096-.588-.096s-.408.03-.588.096a1.758 1.758 0 0 0-.867.76c-.182.311-.24.67-.205.988a2.7 2.7 0 0 0 .268.862c.234.467.537.853.854 1.203c-.293.325-.586.816-1.596 1.495c-1.818 1.224-2.668 1.158-2.668 1.158a14.153 14.153 0 0 0-.264-.881c-.221-.586-.412-1.177-.945-1.769a1.565 1.565 0 0 0-.598-.396a1.397 1.397 0 0 0-.832.019c-.553.168-.836.66-.896 1.04c-.137.794.166 1.538.744 2.107c.566.517 1.287.753 2.043.804c.143.596.273 1.193.424 1.773l.771 3.168A834.101 834.101 0 0 0 29.758 46h-3.246c-1.162-4.073-3.619-7.922-6.209-11.979C17.204 29.158 14 24.13 14 19.586C14 10.992 22.074 4 32 4c9.925 0 18 6.992 18 15.586c0 4.546-3.207 9.575-6.309 14.439m-5.892-2.361c.059-.205.119-.413.189-.613c.189-.527.43-1.1.758-1.443c.078-.088.158-.123.199-.146c0 .004.098-.012.16.019c.111.028.217.143.258.364c.08.428-.123.979-.49 1.324c-.258.245-.656.417-1.074.495m-11.6 0c-.418-.078-.816-.25-1.072-.496c-.369-.345-.57-.896-.49-1.324c.041-.222.146-.336.258-.364c.063-.03.16-.015.16-.019c.039.023.121.059.195.146c.33.344.57.916.76 1.443c.07.201.131.409.189.614"
                  ></path>
                  <path
                    d="M26.52 49.557h-1v3.6h.768v3.201h.768v3.201h1.286C28.947 60.988 30.347 62 32 62c1.652 0 3.051-1.012 3.658-2.443h1.327v-3.221l.112-.041l.655-.24v-2.923l.065-.021l.701-.22v-3.335H26.52z"
                  ></path>
                </g>
              </svg>
            </div>
            <p class="text-2xl text-piper-600 font-bold tracking-widest font-basketball">
              TIPS & TRICK
            </p>
          </div>
          <div class="bg-white w-full min-h-20 md:h-full md:max-h-52 rounded-lg shadow-lg p-5">
            <p class="text-gray-600 text-sm">
              Selain itu, kami juga berkomitmen untuk berbagi pengalaman dan informasi melalui tips
              serta trik yang dapat membantu meningkatkan kemampuan bermain basket. Dengan saling
              mendukung dan berbagi pengetahuan, kami ingin menciptakan lingkungan yang positif,
              inspiratif, dan penuh semangat agar semua pecinta basket dapat tumbuh dan berkembang
              bersama.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layouts>
</template>
