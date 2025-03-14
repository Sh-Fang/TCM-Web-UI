<template>
  <div class="graph-visualization">
    <h1>Graph Visualization</h1>
    <div class="visualization-container">
      <!-- 这里将添加图形可视化组件 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraphVisualizationPage'
}
</script>

<style scoped>
.graph-visualization {
  flex: 1;
  padding: 2rem;
}

.visualization-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
