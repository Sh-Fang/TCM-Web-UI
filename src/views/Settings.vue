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
                >
                <span>浅色</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="settings.theme" 
                  value="dark"
                >
                <span>深色</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  v-model="settings.theme" 
                  value="system"
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
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>图表默认布局</label>
            <select v-model="settings.defaultLayout">
              <option value="force-directed">力导向图</option>
              <option value="circular">环形布局</option>
              <option value="grid">网格布局</option>
              <option value="tree">树形布局</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-header">
          <h3>通知设置</h3>
        </div>

        <div class="settings-form">
          <div class="form-group">
            <label>邮件通知</label>
            <div class="toggle-group">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="settings.emailNotifications"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>浏览器通知</label>
            <div class="toggle-group">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="settings.browserNotifications"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>通知频率</label>
            <select v-model="settings.notificationFrequency">
              <option value="realtime">实时</option>
              <option value="hourly">每小时</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-header">
          <h3>数据设置</h3>
        </div>

        <div class="settings-form">
          <div class="form-group">
            <label>自动保存间隔</label>
            <select v-model="settings.autoSaveInterval">
              <option value="1">1分钟</option>
              <option value="5">5分钟</option>
              <option value="15">15分钟</option>
              <option value="30">30分钟</option>
              <option value="60">1小时</option>
            </select>
          </div>

          <div class="form-group">
            <label>数据导出格式</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="settings.exportFormats" 
                  value="json"
                >
                <span>JSON</span>
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="settings.exportFormats" 
                  value="csv"
                >
                <span>CSV</span>
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="settings.exportFormats" 
                  value="graphml"
                >
                <span>GraphML</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      settings: {
        theme: 'light',
        sidebarExpanded: true,
        defaultLayout: 'force-directed',
        emailNotifications: true,
        browserNotifications: true,
        notificationFrequency: 'realtime',
        autoSaveInterval: '5',
        exportFormats: ['json', 'csv']
      }
    }
  },
  watch: {
    settings: {
      handler(newSettings) {
        console.log('设置已更新:', newSettings)
        // 这里可以添加保存设置的逻辑
      },
      deep: true
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
  color: #1f2937;
  margin: 0;
}

.settings-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

.settings-section {
  background: white;
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
  color: #1f2937;
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
  color: #4b5563;
}

.form-group select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1f2937;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4b5563;
}

.radio-label input[type="radio"],
.checkbox-label input[type="checkbox"] {
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
  background-color: #e5e7eb;
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
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}
</style> 