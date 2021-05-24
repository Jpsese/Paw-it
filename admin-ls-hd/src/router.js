import Vue from 'vue'
import Router from 'vue-router'
import Requests from './views/Requests.vue'
// import Couriers from './views/Couriers.vue'
import Couriers from './views/Couriers.v2.vue'
import Parcels from './views/Parcels.vue'
import RetractedParcels from './views/RetractedParcels.vue'
import Login from './views/Login.vue'
import Loader from './components/AdvLoadingPage.vue'
import SignInWithEmailLink from './views/SignInWithEmailLink.vue'
import SpecialHandlingParcels from './views/SpecialHandlingParcels.vue'
import AccountManagement from './views/AccountManagement.vue'
import Home from './views/Home.vue'
import firebase, { $database } from './plugins/firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/requests',
      name: 'requests',
      component: Requests,
      meta: {
        requiresAuth: true,
        requiresLS: true
      }
    },
    {
      path: '/couriers',
      name: 'couriers',
      component: Couriers,
      meta: {
        requiresAuth: true,
        requiresLS: true
      }
    },
    {
      path: '/parcels',
      name: 'parcels',
      component: Parcels,
      meta: {
        requiresAuth: true,
        requiresLS: true,
        requiresHelpDesk: true
      }
    },
    {
      path: '/retracted',
      name: 'retracted',
      component: RetractedParcels,
      meta: {
        requiresAuth: true,
        requiresLS: true
      }
    },
    {
      path: '/signinwithemaillink',
      name: 'sign-in with email link',
      component: SignInWithEmailLink
    },
    {
      path: '/account-management',
      name: 'account management',
      component: AccountManagement,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/specialparcels',
      name: 'special parcels',
      component: SpecialHandlingParcels,
      meta: {
        requiresAuth: true,
        requiresHelpDesk: true
      }
    },
    {
      path: '/loader',
      component: Loader
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(rec => rec.meta.requiresAuth)
  const requiresAdmin = to.matched.some(rec => rec.meta.requiresAdmin)
  const requiresLS = to.matched.some(rec => rec.meta.requiresLS)
  const requiresHelpDesk = to.matched.some(rec => rec.meta.requiresHelpDesk)

  if (requiresAuth && currentUser) {
    $database(`/employees/${currentUser.uid}`).on('value', snap => {
      const userRole = snap.val().role

      if (requiresHelpDesk && userRole === 'Help Desk Officer') {
        next()
      } else if (requiresAdmin && userRole === 'Admin') {
        next()
      } else if (requiresLS && userRole === 'Logistics Supervisor') {
        next()
      } else if (to.path === '/home') {
        next()
      } else {
        next({ path: '/home' })
      }
    })
    next()
  } else if (to.path !== '/login' && !currentUser) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
