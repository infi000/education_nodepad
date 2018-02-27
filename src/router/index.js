import Vue from 'vue'
import Router from 'vue-router'
import dashboard from '@/components/dashboard'
import group from '@/components/common/dom_group'
import view from '@/components/common/dom_view'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      component: dashboard,
      children:[{
        path:'',
        redirect:'group'
      },{
        path:'/group',
        name:'group',
        component:group
      },{
        path:'/view',
        name:'view',
        components:{
          default:group,
          view:view,
        }
        // component:view
      }]
    }
  ]
})
