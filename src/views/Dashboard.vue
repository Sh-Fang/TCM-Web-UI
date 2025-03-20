<template>
  <div class="dashboard">
    <div class="sidebar-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <font-awesome-icon icon="project-diagram" class="app-logo" />
        <span v-if="!isSidebarCollapsed" class="app-name">子图匹配系统</span>
      </div>
      
      <nav class="dashboard-nav">
        <router-link to="/graph-visualization" class="nav-item">
          <font-awesome-icon icon="project-diagram" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">图可视化</span>
        </router-link>
        <router-link to="/graph-analysis" class="nav-item">
          <font-awesome-icon icon="chart-line" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">图分析</span>
        </router-link>
        <router-link to="/subgraph-matching" class="nav-item">
          <font-awesome-icon icon="search" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">子图匹配</span>
        </router-link>
        <router-link to="/database-data" class="nav-item">
          <font-awesome-icon icon="database" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">数据库管理</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="toggleSidebar">
          <font-awesome-icon :icon="isSidebarCollapsed ? 'chevron-right' : 'chevron-left'" class="collapse-icon" />
        </button>
        <button class="logout-btn" @click="confirmLogout">
          <font-awesome-icon icon="sign-out-alt" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">退出登录</span>
        </button>
      </div>
    </div>

    <!-- 退出登录确认对话框 -->
    <div v-if="showLogoutConfirm" class="confirm-dialog-overlay" @click="showLogoutConfirm = false">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-dialog-header">
          <h3>确认退出</h3>
        </div>
        <div class="confirm-dialog-content">
          <p>您确定要退出登录吗？</p>
        </div>
        <div class="confirm-dialog-footer">
          <button class="btn-cancel" @click="showLogoutConfirm = false">取消</button>
          <button class="btn-confirm" @click="handleLogout">确认退出</button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <header class="top-bar">
        <div class="breadcrumb">
          <h1>{{ currentPageTitle }}</h1>
        </div>
        <div class="user-info">
          <div class="user-profile" @click="toggleUserMenu">
            <div class="user-avatar">
              <font-awesome-icon icon="user-circle" />
            </div>
            <span class="user-name">{{ userInfo.name }}</span>
            <font-awesome-icon :icon="isUserMenuOpen ? 'chevron-up' : 'chevron-down'" class="chevron-icon" />
          </div>
          
          <!-- 用户信息下拉菜单 -->
          <div v-if="isUserMenuOpen" class="user-menu" @click.stop>
            <div class="menu-header">
              <div class="menu-avatar">
                <font-awesome-icon icon="user-circle" />
              </div>
              <div class="menu-user-info">
                <h3>{{ userInfo.name }}</h3>
                <p>{{ userInfo.email }}</p>
              </div>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-items">
              <button class="menu-item" @click="handleProfile">
                <font-awesome-icon icon="user" class="menu-icon" />
                <span>个人资料</span>
              </button>
              <button class="menu-item" @click="handleSettings">
                <font-awesome-icon icon="cog" class="menu-icon" />
                <span>设置</span>
              </button>
              <div class="menu-divider"></div>
              <button class="menu-item logout" @click="confirmLogout">
                <font-awesome-icon icon="sign-out-alt" class="menu-icon" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main class="content-area">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore'


export default {
  name: 'DashboardPage',
  data() {
    return {
      isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
      currentPageTitle: 'Dashboard',
      isUserMenuOpen: false,
      showLogoutConfirm: false
    }
  },
  computed: {
    userInfo() {
      const userStore = useUserStore()
      return userStore.userData // 直接从 Pinia store 获取数据
    }
  },
  watch: {
    '$route'(to) {
      this.currentPageTitle = to.name
    }
  },
  mounted() {
    // 点击其他地方关闭用户菜单
    document.addEventListener('click', this.closeUserMenu)
  },
  beforeUnmount() {
    // 移除事件监听
    document.removeEventListener('click', this.closeUserMenu)
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed)
    },
    toggleUserMenu(event) {
      event.stopPropagation()
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    closeUserMenu() {
      this.isUserMenuOpen = false
    },
    handleProfile() {
      this.isUserMenuOpen = false;
      this.$router.push('/profile');
    },
    handleSettings() {
      this.isUserMenuOpen = false;
      this.$router.push('/settings');
    },
    confirmLogout() {
      this.showLogoutConfirm = true;
    },
    handleLogout() {
      this.showLogoutConfirm = false;

      const userStore = useUserStore()
      userStore.logout()
        .then(() => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error('退出登录失败', error);
        });
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.sidebar-container {
  width: 280px;
  background: var(--sidebar-bg);
  box-shadow: 0 1px 3px var(--shadow-color);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.app-logo {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.app-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dashboard-nav {
  flex: 1;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
}

.nav-item:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.nav-item.router-link-active {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.collapse-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.collapse-icon {
  font-size: 1rem;
}

.logout-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fee2e2;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  background-color: var(--bg-primary);
}

.sidebar-collapsed + .main-content {
  margin-left: 80px;
}

.top-bar {
  height: 64px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.5rem;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: var(--bg-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.user-profile:hover {
  background-color: var(--hover-bg);
}

.chevron-icon {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.user-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: var(--card-bg);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px var(--shadow-color), 0 2px 4px -1px var(--shadow-color);
  z-index: 1000;
}

.menu-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 2rem;
}

.menu-user-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.menu-user-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.5rem 0;
}

.menu-items {
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
}

.menu-item.logout {
  color: #ef4444;
}

.menu-item.logout:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-dialog {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  overflow: hidden;
}

.confirm-dialog-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.confirm-dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.confirm-dialog-content {
  padding: 1.5rem;
  color: #4b5563;
}

.confirm-dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-confirm {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #ef4444;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background-color: #dc2626;
}
</style> 