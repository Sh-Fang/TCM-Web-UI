<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2>个人资料</h2>
      <p>管理您的个人信息和账户设置</p>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <div class="section-header">
          <h3>基本信息</h3>
          <button class="edit-btn" @click="toggleEdit">
            <font-awesome-icon :icon="isEditing ? 'check' : 'pen'" />
            {{ isEditing ? '保存' : '编辑' }}
          </button>
        </div>

        <div class="profile-form">
          <div class="form-group">
            <label>头像</label>
            <div class="avatar-upload">
              <div class="avatar-preview">
                <font-awesome-icon icon="user-circle" />
              </div>
              <button class="upload-btn" :disabled="!isEditing">
                <font-awesome-icon icon="camera" />
                更换头像
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>姓名</label>
            <input 
              type="text" 
              v-model="userInfo.name" 
              :disabled="!isEditing"
              placeholder="请输入您的姓名"
            >
          </div>

          <div class="form-group">
            <label>邮箱</label>
            <input 
              type="email" 
              v-model="userInfo.email" 
              :disabled="!isEditing"
              placeholder="请输入您的邮箱"
            >
          </div>

          <div class="form-group">
            <label>手机号码</label>
            <input 
              type="tel" 
              v-model="userInfo.phone" 
              :disabled="!isEditing"
              placeholder="请输入您的手机号码"
            >
          </div>

          <div class="form-group">
            <label>个人简介</label>
            <textarea 
              v-model="userInfo.bio" 
              :disabled="!isEditing"
              placeholder="请输入您的个人简介"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <div class="section-header">
          <h3>安全设置</h3>
          <button class="edit-btn" @click="togglePasswordEdit">
            <font-awesome-icon :icon="isPasswordEditing ? 'check' : 'pen'" />
            {{ isPasswordEditing ? '保存' : '修改密码' }}
          </button>
        </div>

        <div class="profile-form">
          <div class="form-group">
            <label>当前密码</label>
            <input 
              type="password" 
              v-model="password.current" 
              :disabled="!isPasswordEditing"
              placeholder="请输入当前密码"
            >
          </div>

          <div class="form-group">
            <label>新密码</label>
            <input 
              type="password" 
              v-model="password.new" 
              :disabled="!isPasswordEditing"
              placeholder="请输入新密码"
            >
          </div>

          <div class="form-group">
            <label>确认新密码</label>
            <input 
              type="password" 
              v-model="password.confirm" 
              :disabled="!isPasswordEditing"
              placeholder="请再次输入新密码"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore'

export default {
  name: 'ProfilePage',
  data() {
    return {
      isEditing: false,
      isPasswordEditing: false,
      password: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  computed: {
    userInfo() {
      const userStore = useUserStore()
      return userStore.userData // 直接从 Pinia store 获取数据
    }
  },
  methods: {
    toggleEdit() {
      if (this.isEditing) {
        // 保存更改
        const userStore = useUserStore()
        userStore.updateUserProfile({
          name: this.userInfo.name,
          email: this.userInfo.email
        })
      }
      this.isEditing = !this.isEditing
    },
    togglePasswordEdit() {
      if (this.isPasswordEditing) {
        // 保存密码更改
        console.log('保存密码更改:', this.password)
      }
      this.isPasswordEditing = !this.isPasswordEditing
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.profile-header p {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

.profile-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.edit-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #f3f4f6;
  color: #3b82f6;
}

.profile-form {
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

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 3rem;
}

.upload-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.upload-btn:hover:not(:disabled) {
  background: #f3f4f6;
  color: #3b82f6;
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 