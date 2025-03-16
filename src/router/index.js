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
        name: 'Dashboard',
        component: () => import('../views/GraphVisualization.vue')
      },
      {
        path: 'graph-visualization',
        name: 'GraphVisualization',
        component: () => import('../views/GraphVisualization.vue')
      },
      {
        path: 'graph-analysis',
        name: 'GraphAnalysis',
        component: () => import('../views/GraphAnalysis.vue')
      },
      {
        path: 'subgraph-matching',
        name: 'SubgraphMatching',
        component: () => import('../views/SubgraphMatching.vue')
      },
      {
        path: 'database-data',
        name: 'DatabaseData',
        component: () => import('../views/DatabaseData.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'settings',
        name: 'Settings',
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