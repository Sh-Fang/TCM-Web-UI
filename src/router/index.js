import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
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
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        name: '仪表盘',
        component: () => import('../views/GraphVisualization.vue')
      },
      {
        path: 'graph-visualization',
        name: '图可视化',
        component: () => import('../views/GraphVisualization.vue')
      },
      {
        path: 'graph-analysis',
        name: '图分析',
        component: () => import('../views/GraphAnalysis.vue')
      },
      {
        path: 'subgraph-matching',
        name: '子图匹配',
        component: () => import('../views/SubgraphMatching.vue')
      },
      {
        path: 'database-data',
        name: '数据库管理',
        component: () => import('../views/DatabaseData.vue')
      },
      {
        path: 'profile',
        name: '个人资料',
        component: Profile
      },
      {
        path: 'settings',
        name: '设置',
        component: Settings
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router