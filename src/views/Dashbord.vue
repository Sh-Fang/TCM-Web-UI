<!-- Dashboard.vue -->
<template>
    <div class="dashboard-container">
      <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <div class="sidebar-header">
          <!-- <img src="@/assets/logo.svg" alt="Logo" class="sidebar-logo"> -->
          <h2 v-if="!sidebarCollapsed" class="sidebar-title">GraphMatch</h2>
          <button class="sidebar-toggle" @click="toggleSidebar">
            <i class="icon" :class="sidebarCollapsed ? 'icon-right' : 'icon-left'"></i>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="nav-item" exact>
            <i class="icon icon-dashboard"></i>
            <span v-if="!sidebarCollapsed">Dashboard</span>
          </router-link>
          <router-link to="/graph-visualization" class="nav-item">
            <i class="icon icon-visualization"></i>
            <span v-if="!sidebarCollapsed">Graph Visualization</span>
          </router-link>
          <router-link to="/graph-analysis" class="nav-item">
            <i class="icon icon-analysis"></i>
            <span v-if="!sidebarCollapsed">Graph Analysis</span>
          </router-link>
          <router-link to="/subgraph-matching" class="nav-item">
            <i class="icon icon-matching"></i>
            <span v-if="!sidebarCollapsed">Subgraph Matching</span>
          </router-link>
          <router-link to="/database-data" class="nav-item">
            <i class="icon icon-database"></i>
            <span v-if="!sidebarCollapsed">Database Data</span>
          </router-link>
          <router-link to="/data-export" class="nav-item">
            <i class="icon icon-export"></i>
            <span v-if="!sidebarCollapsed">Data Export</span>
          </router-link>
        </nav>
      </aside>
      
      <div class="main-content">
        <header class="top-header">
          <div class="header-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>
          <div class="header-right">
            <div class="user-menu" @click="toggleUserMenu">
              <img :src="userAvatar" alt="User" class="user-avatar">
              <span class="user-name">{{ userName }}</span>
              <i class="icon icon-down"></i>
              
              <div v-if="userMenuOpen" class="user-dropdown">
                <router-link to="/profile" class="dropdown-item">
                  <i class="icon icon-user"></i>
                  <span>Profile</span>
                </router-link>
                <router-link to="/settings" class="dropdown-item">
                  <i class="icon icon-settings"></i>
                  <span>Settings</span>
                </router-link>
                <div class="dropdown-divider"></div>
                <button @click="logout" class="dropdown-item">
                  <i class="icon icon-logout"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main class="content-area">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sidebarCollapsed: false,
        userMenuOpen: false,
        userName: 'John Doe',
        userAvatar: '@/assets/avatars/user.jpg'
      }
    },
    computed: {
      pageTitle() {
        const route = this.$route.name;
        return route ? route.replace(/-/g, ' ') : 'Dashboard';
      }
    },
    methods: {
      toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
      },
      toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
      },
      logout() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 240px;
    background-color: #1e293b;
    color: #f8fafc;
    transition: width 0.3s ease;
    overflow: hidden;
  }
  
  .sidebar-collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .sidebar-logo {
    width: 30px;
    height: 30px;
  }
  
  .sidebar-title {
    margin-left: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    white-space: nowrap;
  }
  
  .sidebar-toggle {
    margin-left: auto;
    background: none;
    border: none;
    color: #f8fafc;
    cursor: pointer;
  }
  
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: #cbd5e1;
    text-decoration: none;
    transition: background-color 0.2s;
    white-space: nowrap;
  }
  
  .nav-item.router-link-active {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f8fafc;
    border-left: 3px solid #3b82f6;
  }
  
  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .nav-item .icon {
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    text-transform: capitalize;
  }
  
  .user-menu {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-name {
    margin: 0 0.5rem;
    font-weight: 500;
  }
  
  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white