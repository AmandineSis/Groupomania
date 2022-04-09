import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth/AuthView.vue'


const routes = [

  {
    path: '/',
    name: 'auth',
    component: Auth,
    children: [
      {
        // LoginView will be rendered inside Auth's <router-view>
        // when /login is matched
      path: '/',
      component: () => import(/* webpackChunkName: "login" */ '../views/Auth/LoginView.vue')
      },
      {
        // LoginView will be rendered inside Auth's <router-view>
        // when /login is matched
      path: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Auth/LoginView.vue')
      },
      {
        // LoginView will be rendered inside Auth's <router-view>
        // when /signup is matched
      path: 'signup',
      component: () => import(/* webpackChunkName: "signup" */ '../views/Auth/SignUpView.vue')
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
