import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import ForumArticles from '../views/ForumArticles.vue'
import ForumMedias from '../views/ForumMedias.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/forums/articles',
    name: 'ForumArticles',
    component: ForumArticles
  },
  {
    path: '/forums/medias',
    name: 'ForumMedias',
    component: ForumMedias
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
