<!-- src/components/LoadingModal.vue -->
<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  
  defineProps({
    isVisible: Boolean, // 控制模态框是否显示
    message: {
      type: String,
      default: "正在解析文件，请稍候...",
    },
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--modal-overlay);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .modal-content {
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px var(--shadow-color);
    text-align: center;
    max-width: 90%;
    width: 400px;
    }

    .loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-color);
    border-radius: 50%;
    border-top: 3px solid var(--primary-color);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }

    .loading-text {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
    }

  </style>
  