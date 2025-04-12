import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: () => import('@/views/login.vue') },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/views/Layout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/DashBoard.vue') },
      { path: 'article', component: () => import('@/views/Article.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.state.user.token) {
    next('/login')
    return
  }
  next()
})

export default router
