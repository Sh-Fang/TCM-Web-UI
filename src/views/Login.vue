<!-- Login.vue -->
<template>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <font-awesome-icon icon="project-diagram" class="auth-logo" />
          <h1>登录</h1>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
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

          <div class="form-group remember-me">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="rememberMe"
              >
              <span class="checkbox-text">记住邮箱和密码</span>
            </label>
          </div>
          
          <button type="submit" class="btn-primary">
            <font-awesome-icon icon="sign-in-alt" class="btn-icon" />
            登录
          </button>
        </form>
        
        <p class="auth-redirect">
          还没有账号？ 
          <router-link to="/register">
            <font-awesome-icon icon="user-plus" class="link-icon" />
            注册
          </router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useToast } from 'vue-toastification';
  import { useUserStore } from '../store/userStore'

  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
        rememberMe: false,
        errors: {}
      }
    },
    created() {
      // 优先使用路由参数中的数据（来自注册页面）
      const { email, password } = this.$route.query;
      if (email || password) {
        this.email = email || '';
        this.password = password || '';
        this.rememberMe = true; 
        return; // 如果有路由参数，就不再读取localStorage
      }

      // 如果没有路由参数，才尝试从localStorage获取保存的凭据
      const savedCredentials = localStorage.getItem('userCredentials');
      if (savedCredentials) {
        const { email, password } = JSON.parse(savedCredentials);
        this.email = email;
        this.password = password;
        this.rememberMe = true;
      }
    },
    methods: {
      async handleLogin() {
        this.errors = {};
        const toast = useToast();  // 初始化 Toast 实例
        
        // 验证表单
        if (!this.email) {
          this.errors.email = '请输入邮箱';
          return;
        }
        if (!this.password) {
          this.errors.password = '请输入密码';
          return;
        }

        try {
          const response = await axios.post('http://localhost:8082/login', {
            email: this.email,
            password: this.password
          });

          console.log(response);

          if (response.status === 200) {
            // 如果用户选择了"记住我"，保存凭据到 localStorage
            if (this.rememberMe) {
              localStorage.setItem('userCredentials', JSON.stringify({
                email: this.email,
                password: this.password
              }));
            } else {
              // 如果没有选择"记住我"，清除之前保存的凭据
              localStorage.removeItem('userCredentials');
            }

            // 登录成功后，将用户数据存储到 Pinia store
            const userStore = useUserStore()
            const userData = {
              name: response.data.user.name || this.email,  // 如果后端没有返回名字，使用邮箱作为名字
              email: this.email
            };
            userStore.login(userData); // 调用 store 中的 login 方法

            // 登录成功后，跳转到 graph-visualization 页面
            this.$router.push('/graph-visualization');
          } else {
            toast.error('登录失败，请检查用户名和密码');
            this.errors = { general: '登录失败，请检查用户名和密码' };
          }
        } catch (error) {
          if (error.response) {
            // 请求已发出，且服务器返回了响应（非 2xx 状态码）
            if (error.response.status === 404) {
              toast.error('账号未注册');
              this.errors = { general: '账号未注册' };
            } else if (error.response.status === 401) {
              toast.error('密码错误');
              this.errors = { general: '密码错误' };
            } else {
              toast.error('系统繁忙，请稍后重试');
              this.errors = { general: '系统繁忙，请稍后重试' };
            }
          } else if (error.request) {
            // 请求已发出，但没有收到响应
            toast.error('请求未收到响应，请稍后重试');
            this.errors = { general: '请求未收到响应，请稍后重试' };
          } else {
            // 发生了其他错误
            toast.error('系统错误，请稍后重试');
            this.errors = { general: '系统错误，请稍后重试' };
          }
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

  .remember-me {
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
    cursor: pointer;
  }

  .checkbox-text {
    color: #4b5563;
    font-size: 0.875rem;
  }
  </style>