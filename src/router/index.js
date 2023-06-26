import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import InvoiceVue from '../views/InvoiceVue.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/invoice/:invoice_id',
      name: 'Invoice',
      component: InvoiceVue,
    },
  ]
})

export default router
