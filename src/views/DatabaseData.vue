<template>
  <div class="database-data">
    <h1>Database Data</h1>
    <div class="data-container">
      <!-- 这里将添加数据库数据组件 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatabaseDataPage'
}
</script>

<style scoped>
.database-data {
  flex: 1;
  padding: 2rem;
}

.data-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
