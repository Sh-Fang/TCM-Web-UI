<template>
  <div class="subgraph-matching">
    <div class="page-header">
      <h1>子图匹配</h1>
      <p class="subtitle">上传图文件并设置参数进行子图匹配分析</p>
    </div>

    <div class="content-container">
      <div class="file-section">
        <!-- 数据流图上传 -->
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
          </div>
        </div>

        <!-- 查询图上传 -->
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
          </div>
        </div>
      </div>

      <!-- 匹配参数设置 -->
      <div class="parameter-card">
        <div class="parameter-header">
          <font-awesome-icon icon="sliders-h" class="parameter-icon" />
          <h2>匹配参数设置</h2>
        </div>
        <div class="parameter-content">
          <div class="parameters-grid">
            <!-- 数值参数 -->
            <div class="parameter-group">
              <h3 class="group-title">数值参数</h3>
              <div class="parameter-item">
                <label class="parameter-label">最大匹配数量</label>
                <input type="number" v-model="matchParams.maxMatchCount" min="1" class="parameter-input" />
              </div>
              <div class="parameter-item">
                <label class="parameter-label">数据图占比 (%)</label>
                <input type="number" v-model="matchParams.dataGraphPercentage" min="0" max="100" class="parameter-input" />
              </div>
              <div class="parameter-item">
                <label class="parameter-label">索引构建时间限制 (秒)</label>
                <input type="number" v-model="matchParams.indexBuildTimeLimit" min="1" class="parameter-input" />
              </div>
              <div class="parameter-item">
                <label class="parameter-label">查询匹配时间限制 (秒)</label>
                <input type="number" v-model="matchParams.queryMatchTimeLimit" min="1" class="parameter-input" />
              </div>
            </div>

            <!-- 选择参数 -->
            <div class="parameter-group">
              <h3 class="group-title">选择参数</h3>
              <div class="parameter-item">
                <label class="parameter-label">结果模式</label>
                <select v-model="matchParams.resultMode" class="parameter-select">
                  <option value="qid">QID</option>
                  <option value="time">TIME</option>
                </select>
              </div>
              <div class="parameter-item">
                <label class="parameter-label">执行模式</label>
                <select v-model="matchParams.executionMode" class="parameter-select">
                  <option value="count">COUNT</option>
                  <option value="enum">ENUM</option>
                </select>
              </div>
            </div>

            <!-- 布尔参数 -->
            <div class="parameter-group">
              <h3 class="group-title">布尔参数</h3>
              <div class="parameter-item checkbox-item">
                <label class="parameter-label">开启静态合并</label>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="matchParams.enableStaticMerge">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="parameter-item checkbox-item">
                <label class="parameter-label">开启动态合并</label>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="matchParams.enableDynamicMerge">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="parameter-item checkbox-item">
                <label class="parameter-label">返回匹配结果</label>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="matchParams.returnMatchResults">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <!-- 输出格式 -->
            <div class="parameter-group">
              <h3 class="group-title">输出设置</h3>
              <div class="parameter-item">
                <label class="parameter-label">输出格式</label>
                <select v-model="matchParams.outputFormat" class="parameter-select">
                  <option value="JSON">JSON</option>
                  <option value="TXT">TXT</option>
                </select>
              </div>
              <p class="output-note">
                <font-awesome-icon icon="info-circle" class="info-icon" />
                匹配结果将在完成后通过下载按钮获取
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 执行匹配 -->
      <div class="action-card">
        <button 
          class="match-btn" 
          :disabled="!canStartMatching || isMatching"
          @click="startMatching"
        >
          <font-awesome-icon 
            :icon="isMatching ? 'spinner' : 'play'" 
            :class="{ 'fa-spin': isMatching }" 
            class="btn-icon" 
          />
          {{ isMatching ? '匹配中...' : '开始匹配' }}
        </button>

        <!-- 进度条 -->
        <div v-if="isMatching" class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${matchProgress}%` }"></div>
          </div>
          <div class="progress-text">{{ matchProgress }}%</div>
        </div>
      </div>

      <!-- 匹配结果 -->
      <div v-if="matchResults" class="results-card">
        <div class="results-header">
          <font-awesome-icon icon="check-circle" class="results-icon" />
          <h2>匹配结果</h2>
        </div>
        <div class="results-content">
          <div class="results-summary">
            <div class="result-item">
              <span class="result-label">匹配总数</span>
              <span class="result-value">{{ matchResults.totalMatches }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">索引构建时间</span>
              <span class="result-value">{{ matchResults.indexBuildTime }} ms</span>
            </div>
            <div class="result-item">
              <span class="result-label">查询匹配时间</span>
              <span class="result-value">{{ matchResults.queryMatchTime }} ms</span>
            </div>
            <div class="result-item">
              <span class="result-label">内存使用</span>
              <span class="result-value">{{ formatMemory(matchResults.memoryUsage) }}</span>
            </div>
          </div>
          
          <div class="results-summary additional-metrics">
            <div class="result-item">
              <span class="result-label">数据流图边数</span>
              <span class="result-value">{{ matchResults.streamGraphEdges }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">查询图边数</span>
              <span class="result-value">{{ matchResults.queryGraphEdges }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">有效边占比</span>
              <span class="result-value">{{ matchResults.effectiveEdgeRatio }}%</span>
            </div>
          </div>

          <div v-if="matchParams.returnMatchResults && matchResults.matches" class="matches-list">
            <h3>匹配详情</h3>
            <div v-if="matchResults.matches.length > 0" class="matches-table-container">
              <div class="matches-table-scroll">
                <table class="matches-table">
                  <thead>
                    <tr>
                      <th class="id-column">ID</th>
                      <th v-for="(_, index) in Array(matchResults.queryGraphEdges)" :key="index">
                        QID {{ index + 1 }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(match, index) in matchResults.matches" :key="index">
                      <td class="id-column">{{ index + 1 }}</td>
                      <td v-for="(edge, edgeIndex) in match.edges" :key="edgeIndex" class="edge-cell">
                        <div class="edge-tuple">
                          <div class="tuple-row"><span class="tuple-label">src_id: </span>{{ edge[0] }}</div>
                          <div class="tuple-row"><span class="tuple-label">tar_id: </span>{{ edge[1] }}</div>
                          <div class="tuple-row"><span class="tuple-label">e_lab: </span>{{ edge[2] }}</div>
                          <div class="tuple-row"><span class="tuple-label">src_lab: </span>{{ edge[3] }}</div>
                          <div class="tuple-row"><span class="tuple-label">tar_lab: </span>{{ edge[4] }}</div>
                          <div class="tuple-row"><span class="tuple-label">timestamp: </span>{{ edge[5] }}</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p v-else class="no-matches">没有找到匹配结果</p>
          </div>

          <div class="results-actions">
            <button class="action-btn download-btn" @click="downloadResults">
              <font-awesome-icon icon="download" class="btn-icon" />
              下载结果
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'SubgraphMatchingPage',
  data() {
    return {
      streamGraphFile: null,
      queryGraphFile: null,
      matchParams: {
        maxMatchCount: 100,
        dataGraphPercentage: 50,
        indexBuildTimeLimit: 60,
        queryMatchTimeLimit: 60,
        resultMode: 'qid',
        executionMode: 'count',
        enableStaticMerge: true,
        enableDynamicMerge: true,
        returnMatchResults: true,
        outputFormat: 'JSON'
      },
      isMatching: false,
      matchProgress: 0,
      progressInterval: null,
      matchResults: null
    }
  },
  computed: {
    canStartMatching() {
      return this.streamGraphFile && this.queryGraphFile;
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
    },
    triggerFolderSelect() {
      this.$refs.folderInput.click();
    },
    handleFolderSelect(event) {
      const files = event.target.files;
      if (files.length > 0) {
        // 获取第一个文件的路径，并提取其目录
        const path = files[0].webkitRelativePath;
        const folderPath = path.split('/')[0];
        
        // 设置输出路径
        this.matchParams.outputPath = folderPath;
        
        const toast = useToast();
        toast.success(`已选择文件夹: ${folderPath}`);
      }
      // 清空选择，以便下次可以选择同一文件夹
      event.target.value = '';
    },
    openFolderDialog() {
      // 使用新的文件夹选择方法
      this.triggerFolderSelect();
    },
    async startMatching() {
      // 移除环境检查，始终使用模拟数据
      // if (!this.canStartMatching) return;

      this.isMatching = true;
      this.matchProgress = 0;
      
      try {
        // 始终使用模拟数据进行测试
        await this.simulateMatching();
      } catch (error) {
        console.error('Error:', error);
        const toast = useToast();
        toast.error('匹配过程中发生错误');
      }
    },
    // 模拟匹配过程
    async simulateMatching() {
      // 模拟进度更新
      this.progressInterval = setInterval(() => {
        if (this.matchProgress < 100) {
          this.matchProgress += 60;
          if (this.matchProgress > 100) {
            this.matchProgress = 100;
          }
        } else {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
          
          // 模拟匹配完成
          setTimeout(() => {
            this.matchResults = this.generateMockResults();
            this.isMatching = false;
            const toast = useToast();
            toast.success('匹配完成（模拟数据）');
          }, 500);
        }
      }, 800);
    },
    // 生成模拟结果数据
    generateMockResults() {
      // 生成随机匹配数量
      const totalMatches = Math.floor(Math.random() * 20) + 1;
      
      // 生成随机边数
      const streamGraphEdges = Math.floor(Math.random() * 5000) + 1000;
      const queryGraphEdges = Math.floor(Math.random() * 45) + 5; // 5-50条边，模拟真实场景
      const effectiveEdgeRatio = Math.floor(Math.random() * 60) + 40; // 40%-100%
      
      // 根据参数设置生成结果
      const resultData = {
        totalMatches,
        indexBuildTime: Math.floor(Math.random() * 1000) + 100, // 100-1100ms
        queryMatchTime: Math.floor(Math.random() * 5000) + 500, // 500-5500ms
        memoryUsage: Math.floor(Math.random() * 100000000) + 10000000, // 10MB-110MB
        streamGraphEdges,
        queryGraphEdges,
        effectiveEdgeRatio
      };
      
      // 只有在需要返回匹配结果时才生成匹配详情
      if (this.matchParams.returnMatchResults) {
        const matches = [];
        for (let i = 0; i < totalMatches; i++) {
          // 为每个查询边生成一个6元组
          const edges = [];
          for (let j = 0; j < queryGraphEdges; j++) {
            // 生成6元组 (src_id, src_label, src_type, dst_id, dst_label, edge_id)
            const srcId = Math.floor(Math.random() * 1000000) + 500000;
            const srcLabel = Math.floor(Math.random() * 10000) + 1000;
            const eLabel = Math.floor(Math.random() * 10);
            const dstId = Math.floor(Math.random() * 1000000) + 500000;
            const dstLabel = Math.floor(Math.random() * 10000) + 1000;
            const timestamp = Math.floor(Math.random() * 10000000) + 1000000;
            
            edges.push([srcId, srcLabel, eLabel, dstId, dstLabel, timestamp]);
          }
          
          matches.push({ edges });
        }
        
        resultData.matches = matches;
      }
      
      return resultData;
    },
    startProgressPolling() {
      // 移除此方法的内容，因为我们直接在simulateMatching中处理进度
    },
    formatMemory(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    downloadResults() {
      if (!this.matchResults) return;
      
      // 创建一个Blob对象
      const blob = new Blob([JSON.stringify(this.matchResults, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 创建一个临时下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `subgraph-matches-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  },
  beforeUnmount() {
    // 确保组件销毁时清除轮询
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
</script>

<style scoped>
.subgraph-matching {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.file-card, .parameter-card, .action-card, .results-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.file-header, .parameter-header, .results-header {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon, .parameter-icon, .results-icon {
  font-size: 1.5rem;
}

.file-icon.stream {
  color: var(--primary-color);
}

.file-icon.query {
  color: var(--secondary-color);
}

.parameter-icon {
  color: var(--success-color);
}

.results-icon {
  color: var(--success-color);
}

.file-header h2, .parameter-header h2, .results-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.file-content, .parameter-content, .results-content {
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
  border-color: var(--primary-color);
}

.selected-file {
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
  word-break: break-all;
}

.file-hint, .parameter-hint {
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
}

.parameter-description {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.parameter-group {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 1rem;
}

.group-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.parameter-item {
  margin-bottom: 1rem;
}

.parameter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.parameter-input, .parameter-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--input-bg);
  color: var(--text-primary);
}

.checkbox-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--disabled-bg);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: var(--bg-primary);
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.path-input-group {
  display: flex;
  gap: 0.5rem;
}

.path-input {
  flex: 1;
}

.path-browse-btn {
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.path-browse-btn:hover {
  background-color: var(--hover-bg);
}

.action-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  align-items: center;
}

.match-btn {
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.375rem;
  color: var(--text-inverse);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  min-width: 200px;
  justify-content: center;
}

.match-btn:hover:not(:disabled) {
  background-color: var(--primary-color-hover);
}

.match-btn:disabled {
  background-color: var(--disabled-bg);
  cursor: not-allowed;
}

.progress-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background-color: var(--bg-secondary);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 45px;
  text-align: right;
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.additional-metrics {
  margin-top: -0.5rem;
  margin-bottom: 2rem;
  grid-template-columns: repeat(3, 1fr);
}

.result-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  padding: 1rem;
  text-align: center;
}

.result-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.matches-list {
  margin-bottom: 1.5rem;
}

.matches-list h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.matches-table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px var(--shadow-color);
  position: relative;
  display: flex;
  flex-direction: column;
}

.matches-table-scroll {
  overflow-x: auto;
  max-width: 100%;
  overflow-y: scroll;
  -ms-overflow-style: scrollbar;
  padding-bottom: 12px;
  scrollbar-width: auto;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.matches-table-scroll::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  display: block;
}

.matches-table-scroll::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 4px;
  margin: 0 4px;
}

.matches-table-scroll::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
  border: 2px solid var(--scrollbar-track);
}

.matches-table-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

.matches-table-scroll::after {
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  height: 12px;
  background: linear-gradient(to bottom, transparent, var(--shadow-color));
  pointer-events: none;
  z-index: 5;
}

.matches-table-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to right, transparent, var(--bg-primary-alpha));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.matches-table-container:hover::after {
  opacity: 1;
}

.matches-table {
  width: auto;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.matches-table th, .matches-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
  white-space: normal;
  min-width: 180px;
  width: 180px;
  box-sizing: border-box;
}

.matches-table td {
  padding: 0.75rem 1rem;
  vertical-align: top;
}

.matches-table th {
  background-color: var(--bg-secondary);
  font-weight: 500;
  color: var(--text-secondary);
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 1rem;
}

.id-column {
  position: sticky;
  left: 0;
  background-color: var(--bg-secondary);
  z-index: 2;
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.matches-table th.id-column {
  z-index: 3;
  box-shadow: 2px 0 5px -2px var(--shadow-color);
}

.matches-table td.id-column {
  box-shadow: 2px 0 5px -2px var(--shadow-color);
}

.matches-table tr:last-child td {
  border-bottom: none;
}

.edge-cell {
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
}

.edge-tuple {
  background-color: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color);
  display: block;
  margin: 0;
  height: 100%;
}

.tuple-row {
  margin-bottom: 0.25rem;
  line-height: 1.4;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.tuple-row:last-child {
  margin-bottom: 0;
}

.tuple-label {
  font-weight: 500;
  color: var(--text-secondary);
  display: inline-block;
  margin-right: 0;
}

.no-matches {
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
}

.results-actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.download-btn {
  background-color: var(--success-color);
  border: none;
  color: var(--text-inverse);
}

.output-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: 0.375rem;
  border: 1px dashed var(--border-color);
}

.info-icon {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .subgraph-matching {
    padding: 1rem;
  }
  
  .parameters-grid {
    grid-template-columns: 1fr;
  }
  
  .file-section {
    grid-template-columns: 1fr;
  }
  
  .results-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .additional-metrics {
    grid-template-columns: 1fr;
  }
  
  .matches-table th, .matches-table td {
    min-width: 150px;
    width: 150px;
    padding: 0.5rem 0.75rem;
  }
  
  .tuple-label {
    width: 70px;
  }
  
  .tuple-row {
    font-size: 0.8rem;
  }
}
</style>