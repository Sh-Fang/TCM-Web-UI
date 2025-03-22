<template>
  <div class="graph-visualization">
    <h1 class="page-title">图形可视化</h1>

    <!-- Toast提示 -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      <font-awesome-icon :icon="toast.icon" class="toast-icon" />
      {{ toast.message }}
    </div>

    <!-- 文件解析加载中模态框 -->
    <div v-if="isParsingFile" class="modal-overlay">
      <div class="modal-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在解析文件，请稍候...</p>
      </div>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'data' }" @click="activeTab = 'data'">
          <font-awesome-icon icon="project-diagram" class="tab-icon" />
          数据图
        </div>
        <div class="tab" :class="{ active: activeTab === 'query' }" @click="activeTab = 'query'">
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
              <input type="file" ref="dataFileInput" accept=".txt" style="display: none" @change="handleDataFileSelect">
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
              <button class="visualize-btn" :disabled="!dataFile || !parsedDataGraph" @click="visualizeDataGraph">
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
              <input type="file" ref="queryFileInput" accept=".txt" style="display: none"
                @change="handleQueryFileSelect">
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
              <button class="visualize-btn" :disabled="!queryFile || !parsedQueryGraph" @click="visualizeQueryGraph">
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
      <div v-show="activeTab === 'data' && dataGraphVisualized" class="graph-display">
        <div id="data-graph-container" class="graph-canvas">
          <!-- 这里将由您实现数据图可视化 -->
        </div>
      </div>

      <!-- 查询图可视化区域 -->
      <div v-show="activeTab === 'query' && queryGraphVisualized" class="graph-display">
        <div id="query-graph-container" class="graph-canvas">
          <!-- 这里将由您实现查询图可视化 -->
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-show="activeTab === 'data' && !dataGraphVisualized" class="empty-state">
        <font-awesome-icon icon="project-diagram" size="3x" class="empty-icon" />
        <p>请上传文件并点击可视化按钮查看数据图</p>
      </div>
      <div v-show="activeTab === 'query' && !queryGraphVisualized" class="empty-state">
        <font-awesome-icon icon="search" size="3x" class="empty-icon" />
        <p>请上传文件并点击可视化按钮查看查询图</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GraphVisualizationPage',
  data() {
    return {
      // 标签页状态，'data'表示数据图，'query'表示查询图
      activeTab: 'data',

      // 图形是否已经可视化的标志
      dataGraphVisualized: false,
      queryGraphVisualized: false,

      // 用户选择的文件对象
      dataFile: null,
      queryFile: null,

      // 解析后的图数据，包含节点和边的信息
      parsedDataGraph: null,
      parsedQueryGraph: null,

      // G6图实例，用于实际渲染图形
      dataGraph: null,
      queryGraph: null,

      // 文件解析过程中的加载状态
      isParsingFile: false,

      // Toast提示框配置
      toast: {
        show: false,        // 是否显示
        message: '',        // 提示信息
        type: 'error',      // 提示类型：error/success/info
        icon: 'exclamation-circle',  // 图标
        timer: null         // 自动关闭定时器
      }
    }
  },

  // 组件销毁前清理图实例，防止内存泄漏
  beforeUnmount() {
    if (this.dataGraph) {
      this.dataGraph.destroy();
    }
    if (this.queryGraph) {
      this.queryGraph.destroy();
    }
  },

  methods: {
    // 初始化G6图实例，渲染图形
    renderGraph(graph, data) {
      graph.data(data);
      graph.render();
    },

    // 显示Toast提示信息，3秒后自动消失
    showToast(message, type = 'error') {
      if (this.toast.timer) {
        clearTimeout(this.toast.timer);
      }

      let icon = 'exclamation-circle';
      if (type === 'success') {
        icon = 'check-circle';
      } else if (type === 'info') {
        icon = 'info-circle';
      }

      this.toast = {
        show: true,
        message,
        type,
        icon,
        timer: setTimeout(() => {
          this.toast.show = false;
        }, 3000)
      };
    },

    // 格式化文件大小显示
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';

      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 触发数据图文件选择框
    triggerDataFileSelect() {
      this.$refs.dataFileInput.click();
    },

    // 触发查询图文件选择框
    triggerQueryFileSelect() {
      this.$refs.queryFileInput.click();
    },

    // 处理数据图文件选择，开始解析文件
    handleDataFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.dataFile = file;
        this.dataGraphVisualized = false;
        this.isParsingFile = true;
        this.parseDataFile(file);
      }
    },

    // 处理查询图文件选择，开始解析文件
    handleQueryFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.queryFile = file;
        this.queryGraphVisualized = false;
        this.isParsingFile = true;
        this.parseQueryFile(file);
      }
    },

    // 解析数据图文件，使用FileReader读取文件内容
    parseDataFile(file) {
      const fileReader = new FileReader();

      // 文件读取完成后的处理
      fileReader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          this.parsedDataGraph = this.parseDataTXT(fileContent);
          console.log('数据图TXT解析成功:', this.parsedDataGraph);

          // 解析失败时重置状态
          if (this.parsedDataGraph === null) {
            this.dataFile = null;
            this.$refs.dataFileInput.value = '';
          }
        } catch (error) {
          console.error('解析数据图文件失败:', error);
          this.parsedDataGraph = null;
          this.dataFile = null;
          this.$refs.dataFileInput.value = '';
          this.isParsingFile = false;
        } finally {
          this.isParsingFile = false;
        }
      };

      // 文件读取错误处理
      fileReader.onerror = () => {
        console.error('读取数据图文件失败');
        this.parsedDataGraph = null;
        this.dataFile = null;
        this.$refs.dataFileInput.value = '';
        this.isParsingFile = false;
      };

      fileReader.readAsText(file);
    },

    // 解析查询图文件，使用FileReader读取文件内容
    parseQueryFile(file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          this.parsedQueryGraph = this.parseQueryTXT(fileContent);
          console.log('查询图TXT解析成功:', this.parsedQueryGraph);

          if (this.parsedQueryGraph === null) {
            this.queryFile = null;
            this.$refs.queryFileInput.value = '';
          }
        } catch (error) {
          console.error('解析查询图文件失败:', error);
          this.parsedQueryGraph = null;
          this.queryFile = null;
          this.$refs.queryFileInput.value = '';
        } finally {
          this.isParsingFile = false;
        }
      };

      fileReader.onerror = () => {
        console.error('读取查询图文件失败');
        this.parsedQueryGraph = null;
        this.queryFile = null;
        this.$refs.queryFileInput.value = '';
        this.isParsingFile = false;
      };

      fileReader.readAsText(file);
    },

    // 验证数据图格式是否符合要求：6个字段，且都不为空
    validateDataFormat(line) {
      const parts = line.trim().split(' ');
      if (parts.length !== 6) {
        this.showToast('数据图格式错误：每行应包含6个字段（源节点ID、目标节点ID、边标签、源节点标签、目标节点标签、时间戳）');
        return false;
      }
      if (parts.some(part => !part)) {
        this.showToast('数据图格式错误：所有字段都不能为空');
        return false;
      }
      return true;
    },

    // 验证查询图格式是否符合要求：以e开头，7个字段，且都不为空
    validateQueryFormat(line) {
      const parts = line.trim().split(' ');
      if (parts[0] !== 'e') {
        this.showToast('查询图格式错误：第一行必须以"e"开头');
        return false;
      }
      if (parts.length !== 7) {
        this.showToast('查询图格式错误：每行应包含7个字段（e、qid、源节点ID、目标节点ID、边标签、源节点标签、目标节点标签）');
        return false;
      }
      if (parts.some(part => !part)) {
        this.showToast('查询图格式错误：所有字段都不能为空');
        return false;
      }
      return true;
    },

    // 解析数据图TXT文件内容，限制最多100行，过滤孤立节点
    parseDataTXT(content) {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        this.showToast('数据图文件为空');
        return null;
      }

      if (!this.validateDataFormat(lines[0])) {
        return null;
      }

      const nodes = new Map();
      const edges = [];
      const connectedNodes = new Set();  // 记录有连接的节点

      // 限制最大行数为100
      const maxLines = 100;
      if (lines.length > maxLines) {
        this.showToast('数据图文件超过' + maxLines + '行，仅解析前' + maxLines + '行数据', 'info');
      }

      // 解析每一行数据
      for (let i = 0; i < maxLines && i < lines.length; i++) {
        const line = lines[i];
        const parts = line.trim().split(' ');
        if (parts.length >= 6) {
          const [sourceId, targetId, edgeLabel, sourceLabel, targetLabel, timestamp] = parts;

          connectedNodes.add(sourceId);
          connectedNodes.add(targetId);

          // 添加节点
          if (!nodes.has(sourceId)) {
            nodes.set(sourceId, {
              id: sourceId,
              label: sourceLabel
            });
          }

          if (!nodes.has(targetId)) {
            nodes.set(targetId, {
              id: targetId,
              label: targetLabel
            });
          }

          // 添加边，区分自环边和普通边
          if (sourceId !== targetId) {
            edges.push({
              source: sourceId,
              target: targetId,
              label: edgeLabel + ', T' + timestamp,
            });
          } else {
            edges.push({
              source: sourceId,
              target: targetId,
              shape: 'loop',
              label: edgeLabel + ', T' + timestamp,
            });
          }
        }
      }

      // 过滤孤立节点
      const filteredNodes = Array.from(nodes.values()).filter(node => connectedNodes.has(node.id));
      const removedCount = nodes.size - filteredNodes.length;
      if (removedCount > 0) {
        this.showToast(`已过滤 ${removedCount} 个孤立节点`, 'info');
      }

      return {
        nodes: filteredNodes,
        edges: edges
      };
    },

    // 解析查询图TXT文件内容
    parseQueryTXT(content) {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        this.showToast('查询图文件为空');
        return null;
      }

      if (!this.validateQueryFormat(lines[0])) {
        return null;
      }

      const nodes = new Map();
      const edges = [];

      // 解析每一行数据
      for (const line of lines) {
        const parts = line.trim().split(' ');
        if (parts[0] === 'e' && parts.length === 7) {
          const [, qid, sourceId, targetId, edgeLabel, sourceLabel, targetLabel] = parts;

          if (!nodes.has(sourceId)) {
            nodes.set(sourceId, {
              id: sourceId,
              label: sourceLabel
            });
          }

          if (!nodes.has(targetId)) {
            nodes.set(targetId, {
              id: targetId,
              label: targetLabel
            });
          }

          edges.push({
            source: sourceId,
            target: targetId,
            label: 'qid=' + qid + ', label=' + edgeLabel
          });
        }
      }

      return {
        nodes: Array.from(nodes.values()),
        edges: edges
      };
    },

    // 可视化数据图，创建G6实例并渲染
    visualizeDataGraph() {
      if (!this.dataFile || !this.parsedDataGraph) {
        console.error('没有可用的数据图数据');
        return;
      }

      console.log('开始可视化数据图:', this.parsedDataGraph);
      this.dataGraphVisualized = true;

      this.$nextTick(() => {
        const container = document.getElementById('data-graph-container');
        if (container) {
          const width = container.offsetWidth;
          const height = container.offsetHeight;

          if (this.dataGraph) {
            this.dataGraph.destroy();
          }

          // 配置数据图的G6实例
          this.dataGraph = new window.G6.Graph({
            container: "data-graph-container",
            width: width,
            height: height,
            defaultNode: {
              shape: "circle",
              size: [30],
              color: "#5B8FF9",
              style: {
                fill: "#9EC9FF",
                lineWidth: 3
              },
              labelCfg: {
                style: {
                  fill: "#fff",
                  fontSize: 10
                }
              }
            },
            defaultEdge: {
              labelCfg: {
                autoRotate: true
              },
              style: {
                stroke: "#e2e2e2",
                endArrow: true
              }
            },
            fitView: true,
            fitViewPadding: [20, 20, 20, 20],
          });

          this.renderGraph(this.dataGraph, this.parsedDataGraph);
        }
      });
    },

    // 可视化查询图，创建G6实例并渲染
    visualizeQueryGraph() {
      if (!this.queryFile || !this.parsedQueryGraph) {
        console.error('没有可用的查询图数据');
        return;
      }

      this.queryGraphVisualized = true;

      this.$nextTick(() => {
        const container = document.getElementById('query-graph-container');
        if (container) {
          const width = container.offsetWidth;
          const height = container.offsetHeight;

          if (this.queryGraph) {
            this.queryGraph.destroy();
          }

          // 配置查询图的G6实例，使用力导向布局
          this.queryGraph = new window.G6.Graph({
            container: "query-graph-container",
            width: width,
            height: height,
            layout: {
              type: 'force',
              center: [0, 0],
              linkDistance: 300,
              nodeStrength: -20,
            },
            defaultNode: {
              shape: "circle",
              size: [30],
              color: "#5B8FF9",
              style: {
                fill: "#9EC9FF",
                lineWidth: 1
              },
              labelCfg: {
                style: {
                  fill: "#fff",
                  fontSize: 10
                }
              }
            },
            defaultEdge: {
              labelCfg: {
                autoRotate: true
              },
              style: {
                stroke: "#e2e2e2",
                endArrow: true
              }
            },
            fitView: true,
          });
          this.renderGraph(this.queryGraph, this.parsedQueryGraph);
        }
      });
    },

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
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.tabs-container {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-secondary);
}

.tab:hover {
  color: var(--primary-color);
  background-color: var(--hover-bg);
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background-color: var(--bg-secondary);
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
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.file-header {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.5rem;
}

.file-icon.data {
  color: var(--primary-color);
}

.file-icon.query {
  color: var(--secondary-color);
}

.file-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
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
  background-color: var(--bg-secondary);
  border: 1px dashed var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.file-select-btn:hover {
  background-color: var(--hover-bg);
  border-color: var(--border-color-hover);
}

.selected-file {
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
  word-break: break-all;
}

.file-hint {
  color: var(--text-secondary);
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
  background-color: #64C6DA;
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
  background-color: #64C6DA;
}

.visualize-btn:disabled {
  background-color: #64C6DA;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.1rem;
}

/* 可视化容器样式 */
.visualization-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--card-bg);
  box-shadow: 0 1px 3px var(--shadow-color);
}

.empty-state {
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
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
  min-height: 600px;
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
  background-color: var(--bg-secondary);
  border-radius: 0.375rem;
}

.placeholder-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: 0.375rem;
}

.placeholder-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
}

.placeholder-info>div {
  background-color: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  box-shadow: 0 1px 2px var(--shadow-color);
}

.placeholder-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-left: 4px solid var(--primary-color);
  color: var(--text-primary);
  font-size: 0.875rem;
  border-radius: 0 0.25rem 0.25rem 0;
}

/* 模态框样式 */
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stop-btn {
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: background-color 0.2s;
}

.stop-btn:hover {
  background-color: var(--error-color-hover);
}

.stop-icon {
  font-size: 1rem;
}

/* Toast提示样式 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 500;
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

.toast.error {
  background-color: var(--error-color);
}

.toast.success {
  background-color: var(--success-color);
}

.toast.info {
  background-color: var(--info-color);
}

.toast-icon {
  font-size: 1.25rem;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
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
