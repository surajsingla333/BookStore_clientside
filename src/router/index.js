import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Books from '@/components/Books'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/',
      name: 'Books',
      component: Books
    }
  ],
})
