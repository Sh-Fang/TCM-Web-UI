<template>
  <div class="dashboard">
    <div class="sidebar-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="sidebar-header">
        <font-awesome-icon icon="project-diagram" class="app-logo" />
        <span v-if="!isSidebarCollapsed" class="app-name">Graph App</span>
      </div>
      
      <nav class="dashboard-nav">
        <router-link to="/graph-visualization" class="nav-item">
          <font-awesome-icon icon="project-diagram" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Graph Visualization</span>
        </router-link>
        <router-link to="/graph-analysis" class="nav-item">
          <font-awesome-icon icon="chart-line" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Graph Analysis</span>
        </router-link>
        <router-link to="/subgraph-matching" class="nav-item">
          <font-awesome-icon icon="search" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Subgraph Matching</span>
        </router-link>
        <router-link to="/database-data" class="nav-item">
          <font-awesome-icon icon="database" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Database Data</span>
        </router-link>
        <router-link to="/data-export" class="nav-item">
          <font-awesome-icon icon="file-export" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Data Export</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="toggleSidebar">
          <font-awesome-icon :icon="isSidebarCollapsed ? 'chevron-right' : 'chevron-left'" class="collapse-icon" />
        </button>
        <button class="logout-btn" @click="handleLogout">
          <font-awesome-icon icon="sign-out-alt" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">Logout</span>
        </button>
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
              <button class="menu-item logout" @click="handleLogout">
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
export default {
  name: 'DashboardPage',
  data() {
    return {
      isSidebarCollapsed: false,
      currentPageTitle: 'Dashboard',
      isUserMenuOpen: false,
      userInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
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
    handleLogout() {
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.push('/login');
        })
        .catch(error => {
          console.error('Logout failed:', error);
        });
    }
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.sidebar-container {
  width: 280px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #e5e7eb;
}

.app-logo {
  font-size: 1.5rem;
  color: #3b82f6;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
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
  color: #4b5563;
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
  background-color: #f3f4f6;
  color: #3b82f6;
}

.nav-item.router-link-active {
  background-color: #eff6ff;
  color: #3b82f6;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.collapse-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
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
}

.sidebar-collapsed + .main-content {
  margin-left: 80px;
}

.top-bar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
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
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.5rem;
}

.user-name {
  font-weight: 500;
  color: #4b5563;
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
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
  background-color: #f3f4f6;
}

.chevron-icon {
  font-size: 0.875rem;
  color: #6b7280;
}

.user-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 2rem;
}

.menu-user-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.menu-user-info p {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.menu-divider {
  height: 1px;
  background-color: #e5e7eb;
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
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
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
</style> 