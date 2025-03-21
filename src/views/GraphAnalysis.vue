<template>
  <div class="graph-analysis">
    <div class="page-header">
      <h1>图分析</h1>
      <p class="subtitle">分析数据流图和查询图的特征</p>
    </div>

    <LoadingModal :isVisible="isParsingFile" message="正在解析文件，请稍候..." />

    <div class="content-container">
      <!-- Tab 切换按钮 -->
      <div class="tab-buttons">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'stream' }"
          @click="activeTab = 'stream'"
        >
          <font-awesome-icon icon="project-diagram" class="tab-icon stream" />
          数据流图分析
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'query' }"
          @click="activeTab = 'query'"
        >
          <font-awesome-icon icon="search" class="tab-icon query" />
          查询图分析
        </button>
      </div>

      <!-- Tab 内容区域 -->
      <div class="tab-content">
        <!-- 数据流图 Tab -->
        <div v-show="activeTab === 'stream'" class="tab-pane">
          <div class="file-card">
            <div class="file-header">
              <font-awesome-icon icon="project-diagram" class="file-icon stream" />
              <h2>数据流图</h2>
            </div>
            <div class="file-content">
              <div class="file-input-wrapper">
                <input
                  type="file"
                  ref="streamGraphInput"
                  accept=".txt"
                  style="display: none"
                  @change="handleStreamGraphSelect"
                >
                <button class="file-select-btn" @click="triggerStreamGraphSelect">
                  <font-awesome-icon icon="folder-open" class="btn-icon" />
                  选择文件
                </button>
                <p class="selected-file" v-if="streamGraphFile">
                  已选择: {{ streamGraphFile.name }}
                </p>
                <p class="file-hint" v-else>
                  请选择数据流图文件 (仅支持 .txt 格式)
                </p>
              </div>
              <div class="analyze-btn-wrapper">
                <button 
                  class="analyze-btn" 
                  :disabled="!streamGraphFile || isStreamAnalyzing"
                  @click="analyzeStreamGraph"
                >
                  <font-awesome-icon 
                    :icon="isStreamAnalyzing ? 'spinner' : 'chart-bar'" 
                    :class="{ 'fa-spin': isStreamAnalyzing }" 
                    class="btn-icon" 
                  />
                  {{ isStreamAnalyzing ? '分析中...' : '开始分析' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 数据流图分析结果 -->
          <div v-if="streamGraphInfo" class="info-card">
            <div class="info-header">
              <font-awesome-icon icon="chart-bar" class="info-icon stream" />
              <h3>分析结果</h3>
            </div>
            <div class="info-content">
              <div class="info-sections">
                <!-- 基本信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="info-circle" class="section-icon" />
                    基本信息
                  </h4>
                  <div class="section-content">
                    <div class="info-item">
                      <span class="info-label">文件大小</span>
                      <span class="info-value highlight">{{ formatFileSize(streamGraphInfo.fileSize) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">文件路径</span>
                      <span class="info-value path">{{ streamGraphInfo.filePath }}</span>
                    </div>
                  </div>
                </div>

                <!-- 图结构信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="project-diagram" class="section-icon" />
                    图结构信息
                  </h4>
                  <div class="section-content grid-2">
                    <div class="info-item">
                      <span class="info-label">节点数量</span>
                      <span class="info-value highlight">{{ streamGraphInfo.nodeCount }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">边数量</span>
                      <span class="info-value highlight">{{ streamGraphInfo.edgeCount }}</span>
                    </div>
                  </div>
                </div>

                <!-- 图特征信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="chart-line" class="section-icon" />
                    图特征信息
                  </h4>
                  <div class="section-content grid-2">
                    <div class="info-item">
                      <span class="info-label">最大度数</span>
                      <span class="info-value highlight">{{ streamGraphInfo.maxDegree }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">平均度数</span>
                      <span class="info-value highlight">{{ streamGraphInfo.avgDegree.toFixed(2) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">图密度</span>
                      <span class="info-value highlight">{{ streamGraphInfo.density.toFixed(4) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">连通分量</span>
                      <span class="info-value highlight">{{ streamGraphInfo.connectedComponents }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 查询图 Tab -->
        <div v-show="activeTab === 'query'" class="tab-pane">
          <div class="file-card">
            <div class="file-header">
              <font-awesome-icon icon="search" class="file-icon query" />
              <h2>查询图</h2>
            </div>
            <div class="file-content">
              <div class="file-input-wrapper">
                <input
                  type="file"
                  ref="queryGraphInput"
                  accept=".txt"
                  style="display: none"
                  @change="handleQueryGraphSelect"
                >
                <button class="file-select-btn" @click="triggerQueryGraphSelect">
                  <font-awesome-icon icon="folder-open" class="btn-icon" />
                  选择文件
                </button>
                <p class="selected-file" v-if="queryGraphFile">
                  已选择: {{ queryGraphFile.name }}
                </p>
                <p class="file-hint" v-else>
                  请选择查询图文件 (仅支持 .txt 格式)
                </p>
              </div>
              <div class="analyze-btn-wrapper">
                <button 
                  class="analyze-btn" 
                  :disabled="!queryGraphFile || isQueryAnalyzing"
                  @click="analyzeQueryGraph"
                >
                  <font-awesome-icon 
                    :icon="isQueryAnalyzing ? 'spinner' : 'chart-bar'" 
                    :class="{ 'fa-spin': isQueryAnalyzing }" 
                    class="btn-icon" 
                  />
                  {{ isQueryAnalyzing ? '分析中...' : '开始分析' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 查询图分析结果 -->
          <div v-if="queryGraphInfo" class="info-card">
            <div class="info-header">
              <font-awesome-icon icon="chart-bar" class="info-icon query" />
              <h3>分析结果</h3>
            </div>
            <div class="info-content">
              <div class="info-sections">
                <!-- 基本信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="info-circle" class="section-icon" />
                    基本信息
                  </h4>
                  <div class="section-content">
                    <div class="info-item">
                      <span class="info-label">文件大小</span>
                      <span class="info-value highlight">{{ formatFileSize(queryGraphInfo.fileSize) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">文件路径</span>
                      <span class="info-value path">{{ queryGraphInfo.filePath }}</span>
                    </div>
                  </div>
                </div>

                <!-- 图结构信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="project-diagram" class="section-icon" />
                    图结构信息
                  </h4>
                  <div class="section-content grid-2">
                    <div class="info-item">
                      <span class="info-label">节点数量</span>
                      <span class="info-value highlight">{{ queryGraphInfo.nodeCount }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">边数量</span>
                      <span class="info-value highlight">{{ queryGraphInfo.edgeCount }}</span>
                    </div>
                  </div>
                </div>

                <!-- 图特征信息部分 -->
                <div class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="chart-line" class="section-icon" />
                    图特征信息
                  </h4>
                  <div class="section-content grid-2">
                    <div class="info-item">
                      <span class="info-label">最大度数</span>
                      <span class="info-value highlight">{{ queryGraphInfo.maxDegree }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">平均度数</span>
                      <span class="info-value highlight">{{ queryGraphInfo.avgDegree.toFixed(2) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">图密度</span>
                      <span class="info-value highlight">{{ queryGraphInfo.density.toFixed(4) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">连通分量</span>
                      <span class="info-value highlight">{{ queryGraphInfo.connectedComponents }}</span>
                    </div>
                  </div>
                </div>

                <!-- 偏序关系部分 -->
                <div v-if="queryGraphInfo.partialOrders && queryGraphInfo.partialOrders.length > 0" class="info-section">
                  <h4 class="section-title">
                    <font-awesome-icon icon="sort" class="section-icon" />
                    偏序关系
                  </h4>
                  <div class="section-content">
                    <div class="partial-orders-list">
                      <div v-for="(order, index) in queryGraphInfo.partialOrders" :key="index" class="partial-order-item">
                        <div class="order-header">
                          <span class="order-label">偏序关系 {{ index + 1 }}</span>
                        </div>
                        <div class="order-content">
                          <div class="order-nodes">
                            <template v-for="(node, nodeIndex) in order" :key="`node-${index}-${nodeIndex}`">
                              {{ node }}
                              <span v-if="nodeIndex < order.length - 1" class="order-arrow">
                                <font-awesome-icon icon="arrow-right" />
                              </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import LoadingModal from "../components/LoadingModal.vue";

export default {
  name: 'GraphAnalysisPage',
  components: { LoadingModal },
  data() {
    return {
      activeTab: 'stream',
      streamGraphFile: null,
      queryGraphFile: null,
      streamGraphInfo: null,
      queryGraphInfo: null,
      isStreamAnalyzing: false,
      isQueryAnalyzing: false,
      isParsingFile: false,
    }
  },
  methods: {
    triggerStreamGraphSelect() {
      this.$refs.streamGraphInput.click();
    },
    triggerQueryGraphSelect() {
      this.$refs.queryGraphInput.click();
    },
    async handleStreamGraphSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.txt')) {
        const toast = useToast();
        toast.error('请选择 .txt 格式的文件');
        event.target.value = '';
        return;
      }

      this.streamGraphFile = file;
      this.streamGraphInfo = null; // 清除之前的分析结果
    },
    async handleQueryGraphSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.txt')) {
        const toast = useToast();
        toast.error('请选择 .txt 格式的文件');
        event.target.value = '';
        return;
      }

      this.queryGraphFile = file;
      this.queryGraphInfo = null; // 清除之前的分析结果
    },
    async analyzeStreamGraph() {
      if (!this.streamGraphFile) return;

      this.isStreamAnalyzing = true;
      const formData = new FormData();

      this.isParsingFile = true;
      formData.append('streamGraph', this.streamGraphFile);

      try {
        const response = await axios.post('http://localhost:8082/analyzeStreamGraph', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          this.streamGraphInfo = response.data;
          const toast = useToast();
          toast.success('分析完成');
        } else {
          const toast = useToast();
          toast.error('分析失败');
        }
      } catch (error) {
        const toast = useToast();
        toast.error('分析过程中发生错误');
        console.error('Error:', error);
      } finally {
        this.isStreamAnalyzing = false;
        this.isParsingFile = false;
      }
    },
    async analyzeQueryGraph() {
      if (!this.queryGraphFile) return;

      this.isQueryAnalyzing = true;
      const formData = new FormData();
      formData.append('queryGraph', this.queryGraphFile);

      try {
        const response = await axios.post('http://localhost:8082/analyzeQueryGraph', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          this.queryGraphInfo = response.data;
          
          // 提取偏序关系
          await this.extractPartialOrders();
          
          const toast = useToast();
          toast.success('分析完成');
        } else {
          const toast = useToast();
          toast.error('分析失败');
        }
      } catch (error) {
        const toast = useToast();
        toast.error('分析过程中发生错误');
        console.error('Error:', error);
      } finally {
        this.isQueryAnalyzing = false;
      }
    },
    async extractPartialOrders() {
      if (!this.queryGraphFile) return;
      
      try {
        const text = await this.readFileContent(this.queryGraphFile);
        const lines = text.split('\n');
        
        // 提取以 'b ' 开头的行
        const partialOrders = [];
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('b ')) {
            // 分割行并移除第一个元素 'b'
            const nodes = trimmedLine.split(' ').filter(item => item && item !== 'b');
            if (nodes.length > 0) {
              partialOrders.push(nodes);
            }
          }
        }
        
        // 将偏序关系添加到查询图信息中
        if (!this.queryGraphInfo) this.queryGraphInfo = {};
        this.queryGraphInfo.partialOrders = partialOrders;
        
        console.log('提取的偏序关系:', partialOrders);
      } catch (error) {
        console.error('读取文件内容时出错:', error);
      }
    },
    readFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },
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
.graph-analysis {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.content-container {
  margin-top: 2rem;
  min-height: 500px;
  border: 1px solid var(--border-color);
  padding: 1rem;
  background: var(--card-bg);
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin: -1rem -1rem 1.5rem -1rem;
  padding: 0;
  background-color: var(--bg-secondary);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  color: var(--text-secondary);
  background: none;
}

.tab-btn.active {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.tab-btn:hover:not(.active) {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.tab-btn .tab-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.tab-icon {
  font-size: 1rem;
}

.tab-icon.stream {
  color: var(--primary-color);
}

.tab-icon.query {
  color: var(--success-color);
}

.file-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.file-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.file-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.file-icon {
  font-size: 1.5rem;
}

.file-icon.stream {
  color: var(--primary-color);
}

.file-icon.query {
  color: var(--success-color);
}

.file-content {
  padding: 1rem 0;
}

.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.file-select-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.file-select-btn:hover {
  background-color: var(--hover-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.analyze-btn-wrapper {
  display: flex;
  justify-content: center;
}

.analyze-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #64C6DA;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: auto;
  justify-content: center;
}

.analyze-btn:hover:not(:disabled) {
  background-color: #64C6DA;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.analyze-btn:disabled {
  background-color: #64C6DA;
  color: white;
  cursor: not-allowed;
  border: 1px solid var(--border-color);
}

.btn-icon {
  font-size: 1rem;
}

.selected-file {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin: 0;
}

.file-hint {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.info-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.info-header {
  padding: 1.25rem 1.5rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-icon.stream {
  color: var(--primary-color);
}

.info-icon.query {
  color: var(--success-color);
}

.info-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.info-content {
  padding: 1.5rem;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  color: var(--primary-color);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-content.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 1rem;
  color: var(--text-primary);
}

.info-value.highlight {
  font-weight: 600;
  color: var(--primary-color);
}

.info-value.path {
  font-family: monospace;
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 0.25rem;
  word-break: break-all;
  border: 1px solid var(--border-color);
}

.stream .info-value.highlight {
  color: var(--primary-color);
}

.query .info-value.highlight {
  color: var(--success-color);
}

/* 偏序关系样式 */
.partial-orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.partial-order-item {
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.order-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.order-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.order-content {
  padding: 0.75rem;
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.order-nodes {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  color: var(--text-primary);
}

.order-arrow {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .graph-analysis {
    padding: 1rem;
  }
  
  .section-content.grid-2 {
    grid-template-columns: 1fr;
  }
  
  .tab-buttons {
    flex-direction: column;
  }
  
  .analyze-btn {
    width: 100%;
  }
}

.tab-content {
  padding: 1.5rem;
}
</style>
