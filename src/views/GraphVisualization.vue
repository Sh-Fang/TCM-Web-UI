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

    <!-- 可视化渲染加载中模态框 -->
    <div v-if="isVisualizing" class="modal-overlay">
      <div class="modal-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在渲染图形，请稍候...</p>
        <button class="stop-btn" @click="stopVisualization">
          <font-awesome-icon icon="stop" class="stop-icon" />
          终止渲染
        </button>
      </div>
    </div>

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
      parsedQueryGraph: null,

      // 图实例
      dataGraph: null,
      queryGraph: null,

      // 加载状态
      isParsingFile: false,
      isVisualizing: false,

      // 是否应该停止渲染
      shouldStopVisualization: false,

      // Toast提示配置
      toast: {
        show: false,
        message: '',
        type: 'error',
        icon: 'exclamation-circle',
        timer: null
      }
    }
  },
  beforeUnmount() {
    // 组件销毁前清理图实例
    if (this.dataGraph) {
      this.dataGraph.destroy();
    }
    if (this.queryGraph) {
      this.queryGraph.destroy();
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
        // 开始解析前显示加载中
        this.isParsingFile = true;
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
        // 开始解析前显示加载中
        this.isParsingFile = true;
        // 解析文件
        this.parseQueryFile(file);
      }
    },
    
    /**
     * 解析数据图文件
     * @param {File} file - 上传的文件对象
     */
    parseDataFile(file) {
      const fileReader = new FileReader();
      
      fileReader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          
          // 使用专门的数据图解析函数
          this.parsedDataGraph = this.parseDataTXT(fileContent);
          console.log('数据图TXT解析成功:', this.parsedDataGraph);
          
          // 如果解析返回null（格式错误），重置文件选择状态
          if (this.parsedDataGraph === null) {
            this.dataFile = null;
            // 清空文件输入框，这样同一个文件可以重新选择
            this.$refs.dataFileInput.value = '';
          }
        } catch (error) {
          console.error('解析数据图文件失败:', error);
          this.parsedDataGraph = null;
          this.dataFile = null;
          this.$refs.dataFileInput.value = '';
          this.isParsingFile = false;
        } finally {
          // 解析完成后隐藏加载中
          this.isParsingFile = false;
        }
      };
      
      fileReader.onerror = () => {
        console.error('读取数据图文件失败');
        this.parsedDataGraph = null;
        this.dataFile = null;
        this.$refs.dataFileInput.value = '';
        this.isParsingFile = false;
      };
      
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
          this.parsedQueryGraph = this.parseQueryTXT(fileContent);
          console.log('查询图TXT解析成功:', this.parsedQueryGraph);
          
          // 如果解析返回null（格式错误），重置文件选择状态
          if (this.parsedQueryGraph === null) {
            this.queryFile = null;
            // 清空文件输入框，这样同一个文件可以重新选择
            this.$refs.queryFileInput.value = '';
          }
        } catch (error) {
          console.error('解析查询图文件失败:', error);
          this.parsedQueryGraph = null;
          this.queryFile = null;
          this.$refs.queryFileInput.value = '';
        } finally {
          // 解析完成后隐藏加载中
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
    
    /**
     * 显示Toast提示
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型 ('error' | 'success' | 'info')
     */
    showToast(message, type = 'error') {
      // 清除之前的定时器
      if (this.toast.timer) {
        clearTimeout(this.toast.timer);
      }

      // 设置图标
      let icon = 'exclamation-circle';
      if (type === 'success') {
        icon = 'check-circle';
      } else if (type === 'info') {
        icon = 'info-circle';
      }

      // 显示新的toast
      this.toast = {
        show: true,
        message,
        type,
        icon,
        timer: setTimeout(() => {
          this.toast.show = false;
        }, 3000) // 3秒后自动消失
      };
    },

    /**
     * 验证数据图格式
     * @param {string} line - 要验证的行
     * @returns {boolean} 是否符合格式要求
     */
    validateDataFormat(line) {
      const parts = line.trim().split(' ');
      if (parts.length !== 6) {
        this.showToast('数据图格式错误：每行应包含6个字段（源节点ID、目标节点ID、边标签、源节点标签、目标节点标签、时间戳）');
        return false;
      }
      // 验证所有字段都不为空
      if (parts.some(part => !part)) {
        this.showToast('数据图格式错误：所有字段都不能为空');
        return false;
      }
      return true;
    },

    /**
     * 验证查询图格式
     * @param {string} line - 要验证的行
     * @returns {boolean} 是否符合格式要求
     */
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
      // 验证所有字段都不为空
      if (parts.some(part => !part)) {
        this.showToast('查询图格式错误：所有字段都不能为空');
        return false;
      }
      return true;
    },

    /**
     * 解析数据图TXT格式
     */
    parseDataTXT(content) {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        this.showToast('数据图文件为空');
        return null;
      }

      // 验证第一行格式
      if (!this.validateDataFormat(lines[0])) {
        return null;
      }

      const nodes = new Map();
      const edges = [];
      
      // 用于记录节点的连接状态
      const connectedNodes = new Set();
      
      // 限制最大行数为100
      const maxLines = 100;
      if (lines.length > maxLines) {
        this.showToast('数据图文件超过' + maxLines + '行，仅解析前' + maxLines + '行数据', 'info');
      }
      
      // 遍历每一行，最多处理100行
      for (let i = 0; i < maxLines; i++) {
        const line = lines[i];
        const parts = line.trim().split(' ');
        if (parts.length >= 6) {
          const [
            sourceId,
            targetId,
            edgeLabel,
            sourceLabel,
            targetLabel,
            timestamp
          ] = parts;

          // 如果源节点和目标节点相同，则跳过
          // if (sourceId === targetId) {
          //   continue;
          // }

          // 记录有连接的节点
          connectedNodes.add(sourceId);
          connectedNodes.add(targetId);

          // 处理源节点
          if (!nodes.has(sourceId)) {
            nodes.set(sourceId, {
              id: sourceId,
              label: sourceLabel
            });
          }

          // 处理目标节点
          if (!nodes.has(targetId)) {
            nodes.set(targetId, {
              id: targetId,
              label: targetLabel
            });
          }

          // 添加边
          if (sourceId !== targetId) {
            edges.push({
              source: sourceId,
              target: targetId,
              label: edgeLabel + ', T' + timestamp,
            });
          }else{
            edges.push({
              source: sourceId,
              target: targetId,
              shape: 'loop',
              label: edgeLabel + ', T' + timestamp,
            });
          }
        }
      }

      // 过滤掉孤点，只保留有连接的节点
      const filteredNodes = Array.from(nodes.values()).filter(node => connectedNodes.has(node.id));
      
      // 如果有孤点被过滤，显示提示信息
      const removedCount = nodes.size - filteredNodes.length;
      if (removedCount > 0) {
        this.showToast(`已过滤 ${removedCount} 个孤立节点`, 'info');
      }

      return {
        nodes: filteredNodes,
        edges: edges
      };
    },

    /**
     * 解析查询图TXT格式数据
     */
    parseQueryTXT(content) {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        this.showToast('查询图文件为空');
        return null;
      }

      // 验证第一行格式
      if (!this.validateQueryFormat(lines[0])) {
        return null;
      }

      const nodes = new Map();
      const edges = [];
      
      // 遍历每一行
      for (const line of lines) {
        const parts = line.trim().split(' ');
        if (parts[0] === 'e' && parts.length === 7) {
          const [, qid, sourceId, targetId, edgeLabel, sourceLabel, targetLabel] = parts;

          // 处理源节点
          if (!nodes.has(sourceId)) {
            nodes.set(sourceId, {
              id: sourceId,
              label: sourceLabel
            });
          }

          // 处理目标节点
          if (!nodes.has(targetId)) {
            nodes.set(targetId, {
              id: targetId,
              label: targetLabel
            });
          }

          // 添加边
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


    /**
     * 初始化图
     * @param {Graph} graph - G6图实例
     * @param {Object} data - 图数据
     */
     initGraph(graph, data) {
      graph.data(data);
      graph.render();

      // 渲染完成后，关闭弹窗
      this.isVisualizing = false;
      if (this.shouldStopVisualization) {
        console.log('可视化渲染已终止');
      }
    },

    /**
     * 分批渲染图数据
     * @param {Graph} graph - G6图实例
     * @param {Object} data - 图数据
     */
    async renderGraphInBatches(graph, data) {
      const BATCH_SIZE = 100; // 每批处理的节点数
      const nodes = [...data.nodes];
      const edges = [...data.edges];
      
      try {
        // 先渲染所有节点
        for (let i = 0; i < nodes.length && !this.shouldStopVisualization; i += BATCH_SIZE) {
          const batch = nodes.slice(i, i + BATCH_SIZE);
          graph.data({
            nodes: graph.get('nodes').concat(batch),
            edges: graph.get('edges')
          });
          graph.render();
          // 等待下一帧
          await new Promise(resolve => requestAnimationFrame(resolve));
        }

        // 再渲染所有边
        for (let i = 0; i < edges.length && !this.shouldStopVisualization; i += BATCH_SIZE) {
          const batch = edges.slice(i, i + BATCH_SIZE);
          graph.data({
            nodes: graph.get('nodes'),
            edges: graph.get('edges').concat(batch)
          });
          graph.render();
          // 等待下一帧
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
      } finally {
        this.isVisualizing = false;
        if (this.shouldStopVisualization) {
          console.log('可视化渲染已终止');
        }
      }
    },

    /**
     * 终止可视化渲染
     */
    stopVisualization() {
      this.shouldStopVisualization = true;
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
      // this.isVisualizing = true;
      // this.shouldStopVisualization = false;
      
      // 在下一个DOM更新周期执行可视化
      this.$nextTick(() => {
        // 这里是可视化的占位代码，将由您实现实际的可视化逻辑
        const container = document.getElementById('data-graph-container');
        if (container) {
          const width = container.offsetWidth;
          const height = container.offsetHeight;

          // 如果已经存在图实例，先销毁它
          if (this.dataGraph) {
            this.dataGraph.destroy();
          }

          // 创建新的图实例
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
                autoRotate:true
              },
              style: {
                stroke: "#e2e2e2",
                endArrow:true
              }
            },
            fitView: true,
            fitViewPadding: [20, 20, 20, 20],
          });

          // 渲染数据
          this.initGraph(this.dataGraph, this.parsedDataGraph);
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
      
      this.queryGraphVisualized = true;

      // 在下一个DOM更新周期执行可视化
      this.$nextTick(() => {
        // 这里是可视化的占位代码，将由您实现实际的可视化逻辑
        const container = document.getElementById('query-graph-container');
        if (container) {
          const width = container.offsetWidth;
          const height = container.offsetHeight;

          // 如果已经存在图实例，先销毁它
          if (this.queryGraph) {
            this.queryGraph.destroy();
          } 
          this.queryGraph = new window.G6.Graph({
            container: "query-graph-container",
            width: width,
            height: height,
            layout: {
                type: 'force',
                center: [ 0, 0 ],
                linkDistance:300,
                nodeStrength:-20,
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
                autoRotate:true
              },
              style: {
                stroke: "#e2e2e2",
                endArrow:true
              }
            },
            fitView: true,
          });
          this.initGraph(this.queryGraph, this.parsedQueryGraph); 
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
  min-height: 600px;
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 400px;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4b5563;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stop-btn {
  background-color: #ef4444;
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
  background-color: #dc2626;
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
  background-color: #ef4444;
}

.toast.success {
  background-color: #10b981;
}

.toast.info {
  background-color: #3b82f6;
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
</style>
