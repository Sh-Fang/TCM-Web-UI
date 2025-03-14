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
      
      <div class="auth-divider">
        <span>或使用以下方式注册</span>
      </div>
      
      <div class="social-auth">
        <button class="btn-social google">
          <font-awesome-icon icon="google" class="social-icon" />
          <span>Google</span>
        </button>
        <button class="btn-social github">
          <font-awesome-icon icon="github" class="social-icon" />
          <span>GitHub</span>
        </button>
      </div>
      
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
    handleRegister() {
      this.errors = {};
      
      // 验证用户名
      if (!this.name) {
        this.errors.name = '用户名不能为空';
      } else if (this.name.length < 2) {
        this.errors.name = '用户名至少需要2个字符';
      } else if (this.name.length > 20) {
        this.errors.name = '用户名不能超过20个字符';
      }
      
      // 验证邮箱
      if (!this.email) {
        this.errors.email = '邮箱不能为空';
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.errors.email = '请输入有效的邮箱地址';
      }
      
      // 验证密码
      if (!this.password) {
        this.errors.password = '密码不能为空';
      } else if (this.password.length < 6) {
        this.errors.password = '密码至少需要6个字符';
      }
      
      // 验证确认密码
      if (!this.confirmPassword) {
        this.errors.confirmPassword = '请确认密码';
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致';
      }
      
      if (Object.keys(this.errors).length === 0) {
        // 提交注册表单
        this.$store.dispatch('auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push({
            path: '/login',
            query: {
              email: this.email,
              password: this.password
            }
          });
        })
        .catch(error => {
          this.errors = { general: error.message };
        });
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

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: white;
  padding: 0 10px;
  color: #6b7280;
  font-size: 0.875rem;
}

.social-auth {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.social-icon {
  font-size: 1.2rem;
}

.btn-social.google {
  color: #ea4335;
}

.btn-social.github {
  color: #24292e;
}

.btn-social:hover {
  background-color: #f9fafb;
}

.auth-redirect {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
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