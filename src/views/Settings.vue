<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>系统设置</h2>
      <p>自定义您的应用程序偏好设置</p>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <div class="section-header">
          <h3>界面设置</h3>
        </div>

        <div class="settings-form">
          <div class="form-group">
            <label>主题模式</label>
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="settings.theme" 
                  value="light"
                  @change="handleThemeChange"
                >
                <span>浅色</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="settings.theme" 
                  value="dark"
                  @change="handleThemeChange"
                >
                <span>深色</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="settings.theme" 
                  value="system"
                  @change="handleThemeChange"
                >
                <span>跟随系统</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>侧边栏默认展开</label>
            <div class="toggle-group">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="settings.sidebarExpanded"
                  @change="handleSidebarChange"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'SettingsPage',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      settings: {
        theme: localStorage.getItem('theme') || 'system',
        sidebarExpanded: localStorage.getItem('sidebarExpanded') === 'true'
      }
    }
  },
  created() {
    // 初始化主题
    this.initTheme()
    // 如果是system主题，添加系统主题变化的监听
    if (this.settings.theme === 'system') {
      this.addSystemThemeListener()
    }
  },
  beforeUnmount() {
    // 移除系统主题变化的监听
    this.removeSystemThemeListener()
  },
  methods: {
    initTheme() {
      if (this.settings.theme === 'system') {
        // 获取系统主题
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      } else {
        document.documentElement.setAttribute('data-theme', this.settings.theme)
      }
    },
    handleThemeChange() {
      // 保存设置到localStorage
      localStorage.setItem('theme', this.settings.theme)
      
      // 如果是system，添加监听器
      if (this.settings.theme === 'system') {
        this.addSystemThemeListener()
        // 立即应用系统主题
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      } else {
        // 移除系统主题监听器
        this.removeSystemThemeListener()
        // 直接应用选择的主题
        document.documentElement.setAttribute('data-theme', this.settings.theme)
      }
      
      this.toast.success('主题设置已更新')
    },
    handleSidebarChange() {
      // 保存设置到localStorage
      localStorage.setItem('sidebarExpanded', this.settings.sidebarExpanded)
      // 发布侧边栏状态变化事件
      this.$root.$emit('sidebar-expanded-changed', this.settings.sidebarExpanded)
      this.toast.success('侧边栏设置已更新')
    },
    addSystemThemeListener() {
      // 添加系统主题变化的监听
      this.systemThemeListener = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
      window.matchMedia('(prefers-color-scheme: dark)').addListener(this.systemThemeListener)
    },
    removeSystemThemeListener() {
      // 移除系统主题变化的监听
      if (this.systemThemeListener) {
        window.matchMedia('(prefers-color-scheme: dark)').removeListener(this.systemThemeListener)
      }
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-header p {
  color: var(--text-secondary);
  margin: 0.5rem 0 0;
}

.settings-section {
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.radio-label input[type="radio"] {
  width: 1rem;
  height: 1rem;
  margin: 0;
}

.toggle-group {
  display: flex;
  align-items: center;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
  cursor: pointer;
}

.toggle-label input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--toggle-bg);
  transition: .4s;
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}
</style> 