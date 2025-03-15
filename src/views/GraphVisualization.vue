<template>
  <div class="graph-visualization">
    <h1 class="page-title">图形可视化</h1>
    
    <div class="tabs-container">
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'data' }" 
          @click="activeTab = 'data'"
        >
          <font-awesome-icon icon="project-diagram" class="tab-icon" />
          数据图
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'query' }" 
          @click="activeTab = 'query'"
        >
          <font-awesome-icon icon="search" class="tab-icon" />
          查询图
        </div>
      </div>
    </div>
    
    <div class="tab-content">
      <!-- 数据图上传区域 -->
      <div v-if="activeTab === 'data'" class="upload-section">
        <div class="file-card">
          <div class="file-header">
            <font-awesome-icon icon="project-diagram" class="file-icon data" />
            <h2>数据图</h2>
          </div>
          <div class="file-content">
            <div class="file-input-wrapper">
              <input
                type="file"
                ref="dataFileInput"
                accept=".txt"
                style="display: none"
                @change="handleDataFileSelect"
              >
              <button class="file-select-btn" @click="triggerDataFileSelect">
                <font-awesome-icon icon="folder-open" class="btn-icon" />
                选择文件
              </button>
              <p class="selected-file" v-if="dataFile">
                已选择: {{ dataFile.name }}
              </p>
              <p class="file-hint" v-else>
                请选择数据图文件 (支持 .txt 格式)
              </p>
            </div>
            <div class="visualize-btn-wrapper">
              <button 
                class="visualize-btn" 
                :disabled="!dataFile || !parsedDataGraph"
                @click="visualizeDataGraph"
              >
                <font-awesome-icon icon="chart-line" class="btn-icon" />
                可视化数据图
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 查询图上传区域 -->
      <div v-if="activeTab === 'query'" class="upload-section">
        <div class="file-card">
          <div class="file-header">
            <font-awesome-icon icon="search" class="file-icon query" />
            <h2>查询图</h2>
          </div>
          <div class="file-content">
            <div class="file-input-wrapper">
              <input
                type="file"
                ref="queryFileInput"
                accept=".txt"
                style="display: none"
                @change="handleQueryFileSelect"
              >
              <button class="file-select-btn" @click="triggerQueryFileSelect">
                <font-awesome-icon icon="folder-open" class="btn-icon" />
                选择文件
              </button>
              <p class="selected-file" v-if="queryFile">
                已选择: {{ queryFile.name }}
              </p>
              <p class="file-hint" v-else>
                请选择查询图文件 (支持 .txt 格式)
              </p>
            </div>
            <div class="visualize-btn-wrapper">
              <button 
                class="visualize-btn" 
                :disabled="!queryFile || !parsedQueryGraph"
                @click="visualizeQueryGraph"
              >
                <font-awesome-icon icon="chart-line" class="btn-icon" />
                可视化查询图
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 可视化区域 -->
    <div class="visualization-container">
      <!-- 数据图可视化区域 -->
      <div v-if="activeTab === 'data' && dataGraphVisualized" class="graph-display">
        <div id="data-graph-container" class="graph-canvas">
          <!-- 这里将由您实现数据图可视化 -->
        </div>
      </div>
      
      <!-- 查询图可视化区域 -->
      <div v-else-if="activeTab === 'query' && queryGraphVisualized" class="graph-display">
        <div id="query-graph-container" class="graph-canvas">
          <!-- 这里将由您实现查询图可视化 -->
        </div>
      </div>
      
      <!-- 空状态提示 -->
      <div v-else class="empty-state">
        <font-awesome-icon icon="project-diagram" size="3x" class="empty-icon" />
        <p>请上传文件并点击可视化按钮查看图形</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraphVisualizationPage',
  data() {
    return {
      // 当前激活的标签页（'data'或'query'）
      activeTab: 'data',
      
      // 可视化状态标志
      dataGraphVisualized: false,
      queryGraphVisualized: false,
      
      // 上传的文件对象
      dataFile: null,
      queryFile: null,
      
      // 解析后的图数据（将由您实现解析逻辑）
      parsedDataGraph: null,
      parsedQueryGraph: null
    }
  },
  methods: {
    /**
     * 触发数据图文件选择
     */
    triggerDataFileSelect() {
      this.$refs.dataFileInput.click();
    },
    
    /**
     * 触发查询图文件选择
     */
    triggerQueryFileSelect() {
      this.$refs.queryFileInput.click();
    },
    
    /**
     * 处理数据图文件选择事件
     * @param {Event} event - 文件选择事件对象
     */
    handleDataFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.dataFile = file;
        this.dataGraphVisualized = false;
        // 解析文件
        this.parseDataFile(file);
      }
    },
    
    /**
     * 处理查询图文件选择事件
     * @param {Event} event - 文件选择事件对象
     */
    handleQueryFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.queryFile = file;
        this.queryGraphVisualized = false;
        // 解析文件
        this.parseQueryFile(file);
      }
    },
    
    /**
     * 解析数据图文件
     * @param {File} file - 上传的文件对象
     */
    parseDataFile(file) {
      // 根据文件类型解析文件内容
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          
          // 解析TXT文件
          this.parsedDataGraph = this.parseTXT(fileContent);
          console.log('数据图TXT解析成功:', this.parsedDataGraph);
        } catch (error) {
          console.error('解析数据图文件失败:', error);
          this.parsedDataGraph = null;
          // 这里可以添加错误处理逻辑，如显示错误提示
        }
      };
      
      fileReader.onerror = () => {
        console.error('读取数据图文件失败');
        this.parsedDataGraph = null;
        // 这里可以添加错误处理逻辑
      };
      
      // 读取文件内容
      fileReader.readAsText(file);
    },
    
    /**
     * 解析查询图文件
     * @param {File} file - 上传的文件对象
     */
    parseQueryFile(file) {
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          
          // 解析TXT文件
          this.parsedQueryGraph = this.parseTXT(fileContent);
          console.log('查询图TXT解析成功:', this.parsedQueryGraph);
        } catch (error) {
          console.error('解析查询图文件失败:', error);
          this.parsedQueryGraph = null;
        }
      };
      
      fileReader.onerror = () => {
        console.error('读取查询图文件失败');
        this.parsedQueryGraph = null;
      };
      
      // 读取文件内容
      fileReader.readAsText(file);
    },
    
    /**
     * 解析TXT格式数据
     * @param {string} content - TXT文件内容
     * @returns {Object} 解析后的图数据对象
     */
    parseTXT(content) {
      // 简单的TXT解析实现
      // 实际应用中可能需要根据您的TXT格式定制解析逻辑
      const lines = content.split('\n');
      const nodes = [];
      const edges = [];
      
      // 假设TXT格式为：
      // 第一行：节点数量和边数量
      // 接下来是节点列表
      // 然后是边列表
      // 这里仅为示例，实际解析逻辑需要根据您的TXT格式定制
      
      const [nodeCount, edgeCount] = lines[0].split(' ').map(Number);
      
      // 解析节点
      for (let i = 1; i <= nodeCount; i++) {
        if (i >= lines.length) break;
        
        const nodeData = lines[i].trim().split(' ');
        nodes.push({
          id: nodeData[0],
          label: nodeData[1] || nodeData[0],
          // 可以添加更多属性
        });
      }
      
      // 解析边
      for (let i = nodeCount + 1; i <= nodeCount + edgeCount; i++) {
        if (i >= lines.length) break;
        
        const edgeData = lines[i].trim().split(' ');
        edges.push({
          source: edgeData[0],
          target: edgeData[1],
          // 可以添加更多属性
        });
      }
      
      return { nodes, edges };
    },
    
    /**
     * 可视化数据图
     * 此方法将在点击"可视化数据图"按钮时调用
     */
    visualizeDataGraph() {
      if (!this.dataFile || !this.parsedDataGraph) {
        console.error('没有可用的数据图数据');
        return;
      }
      
      console.log('开始可视化数据图:', this.parsedDataGraph);
      this.dataGraphVisualized = true;
      
      // 在下一个DOM更新周期执行可视化
      this.$nextTick(() => {
        // 这里是可视化的占位代码，将由您实现实际的可视化逻辑
        const container = document.getElementById('data-graph-container');
        if (container) {
          container.innerHTML = `
            <div class="visualization-placeholder">
              <div class="placeholder-header">数据图可视化</div>
              <div class="placeholder-info">
                <div>文件名: ${this.dataFile.name}</div>
                <div>节点数: ${this.parsedDataGraph.nodes?.length || 0}</div>
                <div>边数: ${this.parsedDataGraph.edges?.length || 0}</div>
              </div>
              <div class="placeholder-message">
                <font-awesome-icon icon="info-circle" />
                <span>可视化区域已准备就绪，等待实现可视化逻辑</span>
              </div>
            </div>
          `;
        }
      });
    },
    
    /**
     * 可视化查询图
     * 此方法将在点击"可视化查询图"按钮时调用
     */
    visualizeQueryGraph() {
      if (!this.queryFile || !this.parsedQueryGraph) {
        console.error('没有可用的查询图数据');
        return;
      }
      
      console.log('开始可视化查询图:', this.parsedQueryGraph);
      this.queryGraphVisualized = true;
      
      // 在下一个DOM更新周期执行可视化
      this.$nextTick(() => {
        // 这里是可视化的占位代码，将由您实现实际的可视化逻辑
        const container = document.getElementById('query-graph-container');
        if (container) {
          container.innerHTML = `
            <div class="visualization-placeholder">
              <div class="placeholder-header">查询图可视化</div>
              <div class="placeholder-info">
                <div>文件名: ${this.queryFile.name}</div>
                <div>节点数: ${this.parsedQueryGraph.nodes?.length || 0}</div>
                <div>边数: ${this.parsedQueryGraph.edges?.length || 0}</div>
              </div>
              <div class="placeholder-message">
                <font-awesome-icon icon="info-circle" />
                <span>可视化区域已准备就绪，等待实现可视化逻辑</span>
              </div>
            </div>
          `;
        }
      });
    },
    
    /**
     * 格式化文件大小
     * @param {number} bytes - 文件大小（字节）
     * @returns {string} 格式化后的文件大小
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
}
</script>

<style scoped>
.graph-visualization {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.tabs-container {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.tabs {
  display: flex;
  max-width: 600px;
}

.tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  color: #6b7280;
}

.tab:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background-color: #f0f9ff;
}

.tab-icon {
  width: 1rem;
  height: 1rem;
}

.upload-section {
  margin-bottom: 2rem;
}

/* 文件卡片样式 */
.file-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.file-header {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.5rem;
}

.file-icon.data {
  color: #3b82f6;
}

.file-icon.query {
  color: #8b5cf6;
}

.file-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.file-content {
  padding: 1.5rem;
}

.file-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.file-select-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.file-select-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.selected-file {
  color: #4b5563;
  margin: 0;
  text-align: center;
  word-break: break-all;
}

.file-hint {
  color: #9ca3af;
  margin: 0;
  text-align: center;
}

.visualize-btn-wrapper {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.visualize-btn {
  padding: 0.75rem 2rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.visualize-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.visualize-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.1rem;
}

/* 可视化容器样式 */
.visualization-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.7;
}

.graph-display {
  height: 100%;
  min-height: 400px;
}

.graph-canvas {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

/* 可视化占位区域样式 */
.visualization-placeholder {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
}

.placeholder-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #3b82f6;
  padding: 0.5rem 1rem;
  background-color: #eff6ff;
  border-radius: 0.375rem;
}

.placeholder-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
}

.placeholder-info > div {
  background-color: #e0f2fe;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #0369a1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.placeholder-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
  font-size: 0.875rem;
  border-radius: 0 0.25rem 0.25rem 0;
}

@media (max-width: 768px) {
  .graph-visualization {
    padding: 1rem;
  }
  
  .visualize-btn {
    width: 100%;
  }
}
</style>
