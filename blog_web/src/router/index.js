import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Galeria from '@/components/Galeria'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/galerias',
      name: 'Galeria',
      component: Galeria
    }
  ]
})
