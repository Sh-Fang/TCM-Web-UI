<!-- Register.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <font-awesome-icon icon="project-diagram" class="auth-logo" />
        <h1>注册账号</h1>
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">
            <font-awesome-icon icon="user" class="input-icon" />
            用户名
          </label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            :class="{'input-error': errors.name}"
            required
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">
            <font-awesome-icon icon="envelope" class="input-icon" />
            邮箱
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            :class="{'input-error': errors.email}"
            required
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label for="password">
            <font-awesome-icon icon="lock" class="input-icon" />
            密码
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            :class="{'input-error': errors.password}"
            required
          >
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <font-awesome-icon icon="lock" class="input-icon" />
            确认密码
          </label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword"
            :class="{'input-error': errors.confirmPassword}"
            required
          >
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>
        
        <button type="submit" class="btn-primary">
          <font-awesome-icon icon="user-plus" class="btn-icon" />
          注册
        </button>
      </form>
      
      <p class="auth-redirect">
        已有账号？ 
        <router-link to="/login">
          <font-awesome-icon icon="sign-in-alt" class="link-icon" />
          登录
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../store/userStore';

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {}
    }
  },
  methods: {
    async handleRegister() {
      this.errors = {};
      const toast = useToast();  // 初始化 Toast 实例
      // 验证表单
      if (!this.name) {
        this.errors.name = '请输入用户名';
        return;
      }
      if (this.name.length > 20) {
        this.errors.name = '用户名不能超过20个字符';
        return;
      }
      if (!this.email) {
        this.errors.email = '请输入邮箱';
        return;
      }
      if (!this.password) {
        this.errors.password = '请输入密码';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致';
        return;
      }

      try {
        const response = await axios.post('http://localhost:8082/register', {
          name: this.name,
          email: this.email,
          password: this.password
        });

        if (response.status === 200) {
          const userStore = useUserStore();
          await userStore.register(response.data);

          // 注册成功后，跳转到登录页面
          toast.success('注册成功，请登录');
          this.$router.push({
            path: '/login',
            query: {
              email: this.email,
              password: this.password
            }
          });
        } else {
          this.errors = { general: '注册失败，请稍后重试' };
          toast.error('注册失败，请稍后重试');
        }
      } catch (error) {
        this.errors = { general: '注册失败，请稍后重试' }; 
        toast.error('注册失败，请稍后重试');
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.auth-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 400px;
  max-width: 90%;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.auth-form {
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-icon {
  color: #6b7280;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input-error {
  border-color: #ef4444 !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.auth-redirect {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.5rem;
}

.auth-redirect a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.link-icon {
  font-size: 0.9rem;
}

.auth-redirect a:hover {
  text-decoration: underline;
}
</style> 