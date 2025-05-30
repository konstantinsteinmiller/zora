import { createRouter, createWebHashHistory } from 'vue-router'
import MainMenu from '@/components/MainMenu.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main-menu',
      // redirect: 'game',
      component: MainMenu,
    },
    {
      path: '/battle/:worldId',
      name: 'battle',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/components/GameUI.vue'),
    },
    {
      path: '/world/:worldId',
      name: 'world',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/components/WorldUI.vue'),
    },
  ],
})

export default router
