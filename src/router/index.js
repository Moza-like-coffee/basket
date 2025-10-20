import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // MAIN
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/pages/Welcome.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/Login.vue'),
      meta: {
        guest: true,
        title: 'Log in',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/Register.vue'),
      meta: {
        guest: true,
        title: 'Register',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/member/Dashboard.vue'),
      meta: {
        auth: true,
        title: 'Dashboard',
        allowedRoles: ['parent']
      },
    },
    {
      path: '/coach/dashboard',
      name: 'coach.dashboard',
      component: () => import('@/pages/coach/Dashboard.vue'),
      meta: {
        auth: true,
        title: 'Coach Dashboard',
        allowedRoles: ['coach']
      },
    },
    {
      path: '/admin/dashboard',
      name: 'admin.dashboard',
      component: () => import('@/pages/admin/Dashboard.vue'),
      meta: {
        auth: true,
        title: 'Admin Dashboard',
        allowedRoles: ['admin']
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/Profile.vue'),
      meta: {
        auth: true,
        title: 'Profile',
      },
    },

    // Member
    {
      path: '/member',
      name: 'member.index',
      component: () => import('@/pages/member/member/Index.vue'),
      meta: {
        auth: true,
        title: 'Member',
      },
    },
    {
      path: '/member/create',
      name: 'member.create',
      component: () => import('@/pages/member/member/Create.vue'),
      meta: {
        auth: true,
        title: 'Tambah Member',
      },
    },
    {
      path: '/member/:id/edit',
      name: 'member.edit',
      component: () => import('@/pages/member/member/Edit.vue'),
      meta: {
        auth: true,
        title: 'Edit Data Member',
      },
    },
    {
      path: '/member/:id/verification',
      name: 'member.verification',
      component: () => import('@/pages/member/member/Verification.vue'),
      meta: {
        auth: true,
        title: 'Verifikasi Data Member',
      },
    },


    // Coach

     {
      path: '/coach/absensi',
      name: 'coach.absensi.index',
      component: () => import('@/pages/coach/absensi/Index.vue'),
      meta: {
        auth: true,
        title: 'Absensi',
      },
    },

    
    {
      path: '/member',
      name: 'member.index',
      component: () => import('@/pages/member/member/Index.vue'),
      meta: {
        auth: true,
        title: 'Member',
      },
    },
    {
      path: '/member/create',
      name: 'member.create',
      component: () => import('@/pages/member/member/Create.vue'),
      meta: {
        auth: true,
        title: 'Tambah Member',
      },
    },
    {
      path: '/member/:id/edit',
      name: 'member.edit',
      component: () => import('@/pages/member/member/Edit.vue'),
      meta: {
        auth: true,
        title: 'Edit Data Member',
      },
    },
    {
      path: '/member/:id/verification',
      name: 'member.verification',
      component: () => import('@/pages/member/member/Verification.vue'),
      meta: {
        auth: true,
        title: 'Verifikasi Data Member',
      },
    },


    //admin
    {
      path: '/admin/member',
      name: 'admin.member.index',
      component: () => import('@/pages/admin/member/Index.vue'),
      meta: {
        auth: true,
        title: 'Admin Member',
      },
    },
    {
      path: '/admin/member/create',
      name: 'admin.member.create',
      component: () => import('@/pages/admin/member/Create.vue'),
      meta: {
        auth: true,
        title: 'Tambah Admin Member',
      },
    },
    {
      path: '/admin/member/:id/edit',
      name: 'admin.member.edit',
      component: () => import('@/pages/admin/member/Edit.vue'),
      meta: {
        auth: true,
        title: 'Edit Data Member',
      },
    },
    {
      path: '/admin/member/:id/verification',
      name: 'admin.member.verification',
      component: () => import('@/pages/admin/member/Verification.vue'),
      meta: {
        auth: true,
        title: 'Verifikasi Data Member',
      },
    },

    {
      path: '/admin/user',
      name: 'admin.user.index',
      component: () => import('@/pages/admin/user/Index.vue'),
      meta: {
        auth: true,
        title: 'Admin User',
      },
    },
    {
      path: '/admin/user/create',
      name: 'admin.user.create',
      component: () => import('@/pages/admin/user/Create.vue'),
      meta: {
        auth: true,
        title: 'Tambah Admin User',
      },
    },
    {
      path: '/admin/user/:id/edit',
      name: 'admin.user.edit',
      component: () => import('@/pages/admin/user/Edit.vue'),
      meta: {
        auth: true,
        title: 'Edit Data User',
      },
    },
  ],
})

// Loading
router.beforeEach((to, from, next) => {
  const ui = useUIStore()
  ui.startLoading()
  next()
})
router.afterEach(() => {
  const ui = useUIStore()
  setTimeout(() => ui.stopLoading(), 500)
})

// Auth Middleware
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token')
  const isLoggedIn = !!token

  if (to.matched.some((record) => record.meta.auth)) {
    if (!isLoggedIn) {
      return next({ name: 'login' })
    }

    try {
      const authStore = useAuthStore()
      const data = authStore.decryptedUserData

      if (!data) {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('userData')
        return next({ name: 'login' })
      }

      const userRole = data.role
      const allowedRoles = to.meta.allowedRoles

      if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log('Akses ditolak: role tidak sesuai')

        if (userRole === 'admin') {
          return next({ name: 'admin.dashboard' })
        } else if (userRole === 'coach') {
          return next({ name: 'coach.dashboard' })
        } else {
          return next({ name: 'dashboard' })
        }
      }

      return next()
    } catch (err) {
      console.error('Terjadi error saat ambil data user:', err)
      return next({ name: 'login' })
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (isLoggedIn) {
      const authStore = useAuthStore()
      const data = authStore.decryptedUserData
      if (!data) {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('userData')
        return next()
      }
      
      const userRole = data.role
      if (userRole === 'admin') {
        return next({ name: 'admin.dashboard' })
      } else if (userRole === 'coach') {
        return next({ name: 'coach.dashboard' })
      } else {
        return next({ name: 'dashboard' })
      }
    }
    return next()
  } else {
    return next()
  }
})

const APP_NAME = import.meta.env.VITE_APP_NAME
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title)

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title + ' - ' + APP_NAME
  } else {
    document.title = APP_NAME
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) =>
    el.parentNode.removeChild(el),
  )

  if (!nearestWithMeta) return next()

  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta')

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key])
      })

      tag.setAttribute('data-vue-router-controlled', '')

      return tag
    })

    .forEach((tag) => document.head.appendChild(tag))

  next()
})
export default router
