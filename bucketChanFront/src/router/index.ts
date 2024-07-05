import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/badChat/:room?',
      name: 'badchat',
      component: () => import('../views/ChatBad.vue')
    },
    {
      path: '/board/:shortName',
      name: 'board',
      component: () => import('../views/Board.vue')
    }
  ]
})

export default router
