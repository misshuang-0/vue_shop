import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向
  {path:'/',redirect:'/login'}, 
  {path:'/login',component:Login},
  {
    path:'/home',component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
    ]
  },
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to: 将要访问的路径
// from: 从哪个路径跳转而来
// next: 是一个函数，表示放行
      // 之间调用 next()  或者 next('/放行的路径') 强制跳转
router.beforeEach((to,from,next)=>{
  // 如果访问的是登陆页，直接放行
  if(to.path === '/login'){
    return next();
  }
  // 不是登陆页，判断是否有token
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
    next();
})

export default router
