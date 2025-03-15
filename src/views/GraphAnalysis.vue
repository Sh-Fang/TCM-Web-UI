<template>
  <div class="graph-analysis">
    <div class="page-header">
      <h1>图分析</h1>
      <p class="subtitle">分析数据流图和查询图的特征</p>
    </div>

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

export default {
  name: 'GraphAnalysisPage',
  data() {
    return {
      activeTab: 'stream',
      streamGraphFile: null,
      queryGraphFile: null,
      streamGraphInfo: null,
      queryGraphInfo: null,
      isStreamAnalyzing: false,
      isQueryAnalyzing: false
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
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
}

.content-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
  padding: 0 1rem;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #3b82f6;
}

.tab-btn.active {
  color: #3b82f6;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-icon.stream {
  color: #3b82f6;
}

.tab-icon.query {
  color: #8b5cf6;
}

.tab-content {
  padding: 1.5rem;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
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

.file-icon.stream {
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

.analyze-btn-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.analyze-btn {
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

.analyze-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.analyze-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.1rem;
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

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.info-header {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-icon {
  font-size: 1.5rem;
}

.info-icon.stream {
  color: #3b82f6;
}

.info-icon.query {
  color: #8b5cf6;
}

.info-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.info-content {
  padding: 1.5rem;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.section-title {
  margin: 0;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  color: #6b7280;
}

.section-content {
  padding: 1rem;
}

.section-content.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
}

.info-value.highlight {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
}

.info-value.path {
  font-size: 0.875rem;
  word-break: break-all;
  color: #6b7280;
}

.stream .info-value.highlight {
  color: #3b82f6;
}

.query .info-value.highlight {
  color: #8b5cf6;
}
</style>
