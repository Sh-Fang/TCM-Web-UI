// main.js - Vue application entry point
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import './assets/styles/themes.css'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createPinia } from 'pinia'  // 导入 Pinia

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faChartLine, 
  faDatabase, 
  faFileExport, 
  faProjectDiagram,
  faSearch,
  faSignOutAlt,
  faEnvelope,
  faLock,
  faUserPlus,
  faSignInAlt,
  faChevronLeft,
  faChevronRight,
  faUserCircle,
  faUser,
  faCog,
  faChevronUp,
  faChevronDown,
  faInfoCircle,
  faEye,
  faCode,
  faChartBar,
  faFileCode,
  faCircle,
  faMinus,
  faPalette,
  faTag,
  faHighlighter,
  faFileUpload,
  faCloudUploadAlt,
  faFileAlt,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons'
import { 
  faGoogle, 
  faGithub 
} from '@fortawesome/free-brands-svg-icons'

// 添加图标到库中
library.add(
  faChartLine,
  faDatabase,
  faFileExport,
  faProjectDiagram,
  faSearch,
  faSignOutAlt,
  faEnvelope,
  faLock,
  faUserPlus,
  faSignInAlt,
  faGoogle,
  faGithub,
  faChevronLeft,
  faChevronRight,
  faUserCircle,
  faUser,
  faCog,
  faChevronUp,
  faChevronDown,
  faInfoCircle,
  faEye,
  faCode,
  faChartBar,
  faFileCode,
  faCircle,
  faMinus,
  faPalette,
  faTag,
  faHighlighter,
  faFileUpload,
  faCloudUploadAlt,
  faFileAlt,
  faFolderOpen
)

const app = createApp(App)

// 注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

// 创建 Pinia 实例
const pinia = createPinia()

// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'system'
  if (savedTheme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
}

// 初始化主题
initTheme()

app
  .use(router)
  .use(pinia)
  .use(Toast)
  .mount('#app')