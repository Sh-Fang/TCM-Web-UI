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
      <div class="parameter-section">
        <div class="parameter-card">
          <div class="parameter-header">
            <font-awesome-icon icon="sliders" class="parameter-icon" />
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
                    <input 
                      type="checkbox" 
                      v-model="matchParams.returnMatchResults"
                      :disabled="matchParams.executionMode !== 'enum'"
                    >
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 执行匹配 -->
      <div class="action-card">
        <div class="action-content">
          <div class="action-left">
            <div class="output-settings">
              <label class="parameter-label">输出格式</label>
              <select v-model="matchParams.outputFormat" class="parameter-select">
                <option value="JSON">JSON</option>
                <option value="TXT">TXT</option>
              </select>
            </div>
          </div>
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
        </div>

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
              <span class="result-value">{{ matchResults.statistical_info.match_count }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">索引构建时间</span>
              <span class="result-value">{{ matchResults.statistical_info.index_time}} ms</span>
            </div>
            <div class="result-item">
              <span class="result-label">查询匹配时间</span>
              <span class="result-value">{{ matchResults.statistical_info.online_time }} ms</span>
            </div>
            <div class="result-item">
              <span class="result-label">内存使用</span>
              <span class="result-value">{{ matchResults.statistical_info.memory_use }} MB</span>
            </div>
          </div>
          
          <div class="results-summary additional-metrics">
            <div class="result-item">
              <span class="result-label">数据流图边数</span>
              <span class="result-value">{{ matchResults.statistical_info.total_s_edges }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">查询图边数</span>
              <span class="result-value">{{ matchResults.statistical_info.total_q_edges }}</span>
            </div>
            <div class="result-item">
              <span class="result-label">有效边占比</span>
              <span class="result-value">{{ matchResults.statistical_info.valid_percentage }} %</span>
            </div>
          </div>

          <div v-if="matchParams.returnMatchResults && matchResults.all_match_result.all_match_result" class="matches-list">
            <h3>匹配详情</h3>
            <div v-if="matchResults.all_match_result.all_match_result.length > 0" class="matches-table-container">
              <div class="matches-table-scroll">
                <table class="matches-table">
                  <thead>
                    <tr>
                      <th class="id-column">ID</th>
                      <th v-for="(_, index) in matchResults.all_match_result.all_match_result" :key="index">
                        QID {{ index + 1 }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(match, index) in matchResults.all_match_result.all_match_result" :key="index">
                      <td class="id-column">{{ index + 1 }}</td>
                      <td v-for="(edge, edgeIndex) in match" :key="edgeIndex" class="edge-cell">
                        <div class="edge-tuple">
                          <div class="tuple-row"><span class="tuple-label">src_id: </span>{{ edge["src_id"] }}</div>
                          <div class="tuple-row"><span class="tuple-label">tar_id: </span>{{ edge["tar_id"] }}</div>
                          <div class="tuple-row"><span class="tuple-label">e_lab: </span>{{ edge["e_lab"] }}</div>
                          <div class="tuple-row"><span class="tuple-label">src_lab: </span>{{ edge["src_lab"] }}</div>
                          <div class="tuple-row"><span class="tuple-label">tar_lab: </span>{{ edge["tar_lab"] }}</div>
                          <div class="tuple-row"><span class="tuple-label">timestamp: </span>{{ edge["timestamp"] }}</div>
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
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'SubgraphMatchingPage',
  data() {
    return {
      streamGraphFile: null,
      queryGraphFile: null,
      matchParams: {
        maxMatchCount: 100,
        dataGraphPercentage: 60,
        indexBuildTimeLimit: 3600,
        queryMatchTimeLimit: 3600,
        resultMode: 'qid',
        executionMode: 'enum',
        enableStaticMerge: true,
        enableDynamicMerge: true,
        returnMatchResults: true,
        outputFormat: 'JSON'
      },
      isMatching: false,
      matchProgress: 0,
      matchResults: null
    }
  },
  watch: {
    'matchParams.executionMode': {
      handler(newMode) {
        if (newMode !== 'enum') {
          this.matchParams.returnMatchResults = false;
        } else {
          this.matchParams.returnMatchResults = true;
        }
      },
      immediate: true
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
    async startMatching() {
      if (!this.canStartMatching) return;

      this.isMatching = true;
      this.matchProgress = 0;

      const formData = new FormData();
      formData.append('streamGraph', this.streamGraphFile);
      formData.append('queryGraph', this.queryGraphFile);
      const params = {
        max_match_count: this.matchParams.maxMatchCount,
        data_percent: this.matchParams.dataGraphPercentage / 100,
        index_time_limit: this.matchParams.indexBuildTimeLimit,
        online_time_limit: this.matchParams.queryMatchTimeLimit,
        result_mode: this.matchParams.resultMode,
        execute_mode: this.matchParams.executionMode,
        is_using_static_merge: this.matchParams.enableStaticMerge,
        is_using_dynamic_merge: this.matchParams.enableDynamicMerge,
        is_return_match_result: this.matchParams.returnMatchResults,
        output_format: this.matchParams.outputFormat
      };
      formData.append('params', JSON.stringify(params));

      try {
        // 每秒查询一次进度
        const progressInterval = setInterval(async () => {
          try {
            const progressResponse = await axios.get('http://localhost:8082/progress');
            if (progressResponse.status === 200) {
              console.log(progressResponse.data.progress);
              this.matchProgress = parseInt(progressResponse.data.progress) || 0;
            }
          } catch (error) {
            console.error('Progress query error:', error);
          }
        }, 500); // 每秒查询一次进度

        const response = await axios.post('http://localhost:8082/match', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // 主匹配请求完成后，使用 clearInterval 停止进度查询
        clearInterval(progressInterval);

        if (response.status === 200) {
          this.matchResults = response.data;
          console.log(this.matchResults);
        }
      } catch (error) {
        console.error('Error:', error);
        const toast = useToast();
        toast.error('匹配过程中发生错误');
      } finally {
        this.isMatching = false;
      } 
    },
    downloadResults() {
      console.log("downloadResults");
    }
  },
  beforeUnmount() {
    // 确保组件销毁时清除轮询
    // if (this.progressInterval) {
    //   clearInterval(this.progressInterval);
    // }
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
  gap: 2rem;
}

.file-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.parameter-section {
  width: 100%;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.parameter-group {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
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

.toggle-switch input:disabled + .toggle-slider {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-switch input:disabled + .toggle-slider:before {
  cursor: not-allowed;
}

.toggle-switch input:disabled {
  cursor: not-allowed;
}

.toggle-switch input:disabled + .toggle-slider:hover {
  background-color: var(--disabled-bg);
}

.toggle-switch input:disabled + .toggle-slider:before {
  background-color: var(--bg-primary);
  transform: translateX(0);
}

.toggle-switch input:checked:disabled + .toggle-slider:before {
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
  gap: 2rem;
  padding: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem 2rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.action-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.output-settings {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.output-settings .parameter-label {
  margin: 0;
  white-space: nowrap;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9375rem;
}

.output-settings .parameter-select {
  width: 120px;
  margin: 0;
  padding: 0.5rem 1rem;
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  border-color: var(--border-color);
  transition: all 0.2s ease;
}

.match-btn {
  padding: 0.875rem 3rem;
  background-color: #4A9EFF;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  min-width: 200px;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(74, 158, 255, 0.2);
}

.match-btn:hover:not(:disabled) {
  background-color: #3B8EEF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.match-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(74, 158, 255, 0.2);
}

.match-btn:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: not-allowed;
  border: 1px solid var(--border-color);
  box-shadow: none;
}

.match-btn .btn-icon {
  font-size: 1.125rem;
}

.progress-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.progress-fill {
  height: 100%;
  background-color: #4A9EFF;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: 600;
  color: var(--text-primary);
  min-width: 48px;
  text-align: right;
  font-size: 0.9375rem;
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

@media (max-width: 1200px) {
  .parameters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .file-section {
    grid-template-columns: 1fr;
  }
  
  .parameters-grid {
    grid-template-columns: 1fr;
  }
  
  .action-content {
    flex-direction: column;
    padding: 1.5rem;
  }

  .action-left {
    width: 100%;
    justify-content: space-between;
  }

  .output-settings {
    width: auto;
  }

  .match-btn {
    width: 100%;
  }
  
  .progress-container {
    max-width: 100%;
  }
}
</style>