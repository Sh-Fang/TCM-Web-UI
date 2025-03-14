// main.js - Vue application entry point
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'

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
  faChevronDown
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
  faChevronDown
)

const app = createApp(App)

// 注册 Font Awesome 组件
app.component('font-awesome-icon', FontAwesomeIcon)

app
  .use(router)
  .use(store)
  .mount('#app')