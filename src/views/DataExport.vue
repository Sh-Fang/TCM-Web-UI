<template>
  <div class="data-export">
    <h1>Data Export</h1>
    <div class="export-container">
      <!-- 这里将添加数据导出组件 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataExportPage'
}
</script>

<style scoped>
.data-export {
  flex: 1;
  padding: 2rem;
}

.export-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
