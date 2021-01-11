import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/overview',
    name: 'Overview',
    alias: '/',
    component: () => import('../views/Overview.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/waiting_list',
    name: 'WaitingList',
    component: () => import('../views/WaitingList.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

async function waitForStorageToBeReady() {
  await store.restored
}

router.beforeEach((to, from, next) => {
  waitForStorageToBeReady()
  store.state.viewName = to.name
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.loggedIn) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
