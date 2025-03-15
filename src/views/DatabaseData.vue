<template>
  <div class="database-data">
    <h1>数据库数据</h1>
    <div class="data-container">
      <div class="tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <font-awesome-icon :icon="tab.icon" />
          {{ tab.name }}
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 数据集表格 -->
        <div v-if="activeTab === 'datasets'" class="table-container">
          <h2><font-awesome-icon icon="database" /> 数据集列表</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>数据集名称</th>
                <th>描述</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dataset in datasets" :key="dataset.id">
                <td>{{ dataset.id }}</td>
                <td>{{ dataset.name }}</td>
                <td>{{ dataset.description }}</td>
                <td>{{ dataset.created_at }}</td>
                <td class="action-buttons">
                  <button class="btn btn-view" @click="viewDataset(dataset.id)">
                    <font-awesome-icon icon="eye" /> 查看
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 数据图表格 -->
        <div v-if="activeTab === 'data_graphs'" class="table-container">
          <h2><font-awesome-icon icon="project-diagram" /> 数据图列表</h2>
          <div class="filter-container">
            <div class="filter-group">
              <label><font-awesome-icon icon="filter" /> 按数据集筛选：</label>
              <select v-model="selectedDataset" class="filter-select">
                <option value="">全部</option>
                <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
                  {{ dataset.name }}
                </option>
              </select>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>所属数据集</th>
                <th>文件路径</th>
                <th>数据大小</th>
                <th>上传时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="graph in filteredDataGraphs" :key="graph.id">
                <td>{{ graph.id }}</td>
                <td>{{ getDatasetName(graph.dataset_id) }}</td>
                <td>{{ graph.file_path }}</td>
                <td>{{ formatFileSize(graph.file_size) }}</td>
                <td>{{ graph.uploaded_at }}</td>
                <td class="action-buttons">
                  <button class="btn btn-view" @click="viewDataGraph(graph.id)">
                    <font-awesome-icon icon="eye" /> 查看
                  </button>
                  <button class="btn btn-download" @click="downloadGraph(graph.id, 'data_graph')">
                    <font-awesome-icon icon="download" /> 下载
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 查询图表格 -->
        <div v-if="activeTab === 'query_graphs'" class="table-container">
          <h2><font-awesome-icon icon="search" /> 查询图列表</h2>
          <div class="filter-container">
            <div class="filter-group">
              <label><font-awesome-icon icon="filter" /> 按数据集筛选：</label>
              <select v-model="selectedDataset" class="filter-select">
                <option value="">全部</option>
                <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
                  {{ dataset.name }}
                </option>
              </select>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>所属数据集</th>
                <th>文件路径</th>
                <th>数据大小</th>
                <th>上传时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="graph in filteredQueryGraphs" :key="graph.id">
                <td>{{ graph.id }}</td>
                <td>{{ getDatasetName(graph.dataset_id) }}</td>
                <td>{{ graph.file_path }}</td>
                <td>{{ formatFileSize(graph.file_size) }}</td>
                <td>{{ graph.uploaded_at }}</td>
                <td class="action-buttons">
                  <button class="btn btn-view" @click="viewQueryGraph(graph.id)">
                    <font-awesome-icon icon="eye" /> 查看
                  </button>
                  <button class="btn btn-download" @click="downloadGraph(graph.id, 'query_graph')">
                    <font-awesome-icon icon="download" /> 下载
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 模态框组件 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>
            <font-awesome-icon :icon="getModalIcon()" />
            {{ modalTitle }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content">
          <!-- 数据集详情 -->
          <div v-if="modalType === 'dataset' && selectedItem">
            <div class="detail-section">
              <h4><font-awesome-icon icon="info-circle" /> 基本信息</h4>
              <div class="detail-item">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ selectedItem.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">数据集名称:</span>
                <span class="detail-value">{{ selectedItem.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">描述:</span>
                <span class="detail-value">{{ selectedItem.description }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间:</span>
                <span class="detail-value">{{ selectedItem.created_at }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4><font-awesome-icon icon="chart-pie" /> 数据汇总</h4>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="project-diagram" /></div>
                  <div class="stat-value">{{ selectedItem.data_graph_count }}</div>
                  <div class="stat-label">数据图数量</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="search" /></div>
                  <div class="stat-value">{{ selectedItem.query_graph_count }}</div>
                  <div class="stat-label">查询图数量</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="dot-circle" /></div>
                  <div class="stat-value">{{ selectedItem.total_nodes }}</div>
                  <div class="stat-label">总节点数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="link" /></div>
                  <div class="stat-value">{{ selectedItem.total_edges }}</div>
                  <div class="stat-label">总边数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="network-wired" /></div>
                  <div class="stat-value">{{ selectedItem.avg_degree }}</div>
                  <div class="stat-label">平均度数</div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4><font-awesome-icon icon="sticky-note" /> 备注信息</h4>
              <div class="notes-box">
                {{ selectedItem.notes }}
              </div>
            </div>
            
            <div class="detail-section">
              <h4><font-awesome-icon icon="project-diagram" /> 相关数据图</h4>
              <ul class="related-items">
                <li v-for="graph in getRelatedDataGraphs(selectedItem.id)" :key="graph.id">
                  <font-awesome-icon icon="file-code" />
                  <span class="item-name">{{ graph.file_path }}</span>
                  <span class="item-meta">节点: {{ graph.node_count || '未知' }}, 边: {{ graph.edge_count || '未知' }}</span>
                </li>
              </ul>
            </div>
            
            <div class="detail-section">
              <h4><font-awesome-icon icon="search" /> 相关查询图</h4>
              <ul class="related-items">
                <li v-for="graph in getRelatedQueryGraphs(selectedItem.id)" :key="graph.id">
                  <font-awesome-icon icon="file-code" />
                  <span class="item-name">{{ graph.file_path }}</span>
                  <span class="item-meta">节点: {{ graph.node_count || '未知' }}, 边: {{ graph.edge_count || '未知' }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 数据图详情 -->
          <div v-if="modalType === 'data_graph' && selectedItem">
            <div class="detail-section">
              <h4><font-awesome-icon icon="info-circle" /> 基本信息</h4>
              <div class="detail-item">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ selectedItem.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">所属数据集:</span>
                <span class="detail-value">{{ getDatasetName(selectedItem.dataset_id) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">文件路径:</span>
                <span class="detail-value">{{ selectedItem.file_path }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">数据大小:</span>
                <span class="detail-value">{{ formatFileSize(selectedItem.file_size) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">上传时间:</span>
                <span class="detail-value">{{ selectedItem.uploaded_at }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4><font-awesome-icon icon="chart-bar" /> 图结构信息</h4>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="dot-circle" /></div>
                  <div class="stat-value">{{ selectedItem.node_count }}</div>
                  <div class="stat-label">节点总数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="link" /></div>
                  <div class="stat-value">{{ selectedItem.edge_count }}</div>
                  <div class="stat-label">边总数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="star" /></div>
                  <div class="stat-value">{{ selectedItem.max_degree }}</div>
                  <div class="stat-label">最大度数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="network-wired" /></div>
                  <div class="stat-value">{{ selectedItem.avg_degree }}</div>
                  <div class="stat-label">平均度数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="ruler-horizontal" /></div>
                  <div class="stat-value">{{ selectedItem.graph_diameter }}</div>
                  <div class="stat-label">图直径</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon"><font-awesome-icon icon="object-group" /></div>
                  <div class="stat-value">{{ selectedItem.connected_components }}</div>
                  <div class="stat-label">连通分量</div>
                </div>
              </div>
            </div>
            
            <div class="graph-preview">
              <h4><font-awesome-icon icon="eye" /> 图预览</h4>
              <div class="graph-placeholder">
                <!-- 这里可以放置图的预览，目前用占位符 -->
                <div class="placeholder-text">
                  <font-awesome-icon icon="project-diagram" size="3x" />
                  <div>数据图预览 ({{ selectedItem.file_path }})</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 查询图详情 -->
          <div v-if="modalType === 'query_graph' && selectedItem">
            <div class="detail-section">
              <h4><font-awesome-icon icon="info-circle" /> 基本信息</h4>
              <div class="detail-item">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ selectedItem.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">所属数据集:</span>
                <span class="detail-value">{{ getDatasetName(selectedItem.dataset_id) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">文件路径:</span>
                <span class="detail-value">{{ selectedItem.file_path }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">数据大小:</span>
                <span class="detail-value">{{ formatFileSize(selectedItem.file_size) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">上传时间:</span>
                <span class="detail-value">{{ selectedItem.uploaded_at }}</span>
              </div>
              <div class="detail-item" v-if="selectedItem.node_count">
                <span class="detail-label">节点数:</span>
                <span class="detail-value">{{ selectedItem.node_count }}</span>
              </div>
              <div class="detail-item" v-if="selectedItem.edge_count">
                <span class="detail-label">边数:</span>
                <span class="detail-value">{{ selectedItem.edge_count }}</span>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedItem.graph_data">
              <h4><font-awesome-icon icon="code" /> 查询图数据</h4>
              <pre class="code-block">{{ formatJson(selectedItem.graph_data) }}</pre>
            </div>
            
            <div class="graph-preview">
              <h4><font-awesome-icon icon="eye" /> 图预览</h4>
              <div class="graph-placeholder">
                <!-- 这里可以放置图的预览，目前用占位符 -->
                <div class="placeholder-text">
                  <font-awesome-icon icon="search" size="3x" />
                  <div>查询图预览 ({{ selectedItem.file_path }})</div>
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
export default {
  name: 'DatabaseDataPage',
  data() {
    return {
      activeTab: 'datasets',
      selectedDataset: '',
      tabs: [
        { id: 'datasets', name: '数据集', icon: ['fas', 'database'] },
        { id: 'data_graphs', name: '数据图', icon: ['fas', 'project-diagram'] },
        { id: 'query_graphs', name: '查询图', icon: ['fas', 'search'] }
      ],
      // 假数据
      datasets: [
        { 
          id: 1, 
          name: 'A', 
          description: '数据集A的描述信息', 
          created_at: '2023-05-10',
          notes: '这是一个用于测试的数据集，包含了基本的图结构和查询示例',
          data_graph_count: 1,
          query_graph_count: 3,
          total_nodes: 1500,
          total_edges: 4200,
          avg_degree: 5.6
        },
        { 
          id: 2, 
          name: 'B', 
          description: '数据集B的描述信息', 
          created_at: '2023-05-15',
          notes: '这个数据集包含了更复杂的图结构，适合高级查询测试',
          data_graph_count: 1,
          query_graph_count: 2,
          total_nodes: 2800,
          total_edges: 9100,
          avg_degree: 6.5
        },
        { 
          id: 3, 
          name: 'C', 
          description: '数据集C的描述信息', 
          created_at: '2023-06-01',
          notes: '这是一个小型数据集，适合快速测试和验证',
          data_graph_count: 1,
          query_graph_count: 3,
          total_nodes: 800,
          total_edges: 2100,
          avg_degree: 5.25
        },
        { 
          id: 4, 
          name: 'D', 
          description: '数据集D的描述信息', 
          created_at: '2023-06-20',
          notes: '这是最新的数据集，包含了最新的图结构和查询模式',
          data_graph_count: 1,
          query_graph_count: 2,
          total_nodes: 3500,
          total_edges: 12000,
          avg_degree: 6.85
        }
      ],
      dataGraphs: [
        { 
          id: 1, 
          dataset_id: 1, 
          file_path: '/data/A/data_graph.json', 
          file_size: 15728640, // 15MB
          uploaded_at: '2023-05-10',
          node_count: 1500,
          edge_count: 4200,
          max_degree: 28,
          avg_degree: 5.6,
          graph_diameter: 12,
          connected_components: 1
        },
        { 
          id: 2, 
          dataset_id: 2, 
          file_path: '/data/B/data_graph.json', 
          file_size: 31457280, // 30MB
          uploaded_at: '2023-05-15',
          node_count: 2800,
          edge_count: 9100,
          max_degree: 42,
          avg_degree: 6.5,
          graph_diameter: 15,
          connected_components: 1
        },
        { 
          id: 3, 
          dataset_id: 3, 
          file_path: '/data/C/data_graph.json', 
          file_size: 8388608, // 8MB
          uploaded_at: '2023-06-01',
          node_count: 800,
          edge_count: 2100,
          max_degree: 18,
          avg_degree: 5.25,
          graph_diameter: 9,
          connected_components: 2
        },
        { 
          id: 4, 
          dataset_id: 4, 
          file_path: '/data/D/data_graph.json', 
          file_size: 41943040, // 40MB
          uploaded_at: '2023-06-20',
          node_count: 3500,
          edge_count: 12000,
          max_degree: 56,
          avg_degree: 6.85,
          graph_diameter: 18,
          connected_components: 1
        }
      ],
      queryGraphs: [
        { 
          id: 1, 
          dataset_id: 1, 
          file_path: '/data/A/query_graph_1.json', 
          file_size: 2048, // 2KB
          uploaded_at: '2023-05-10',
          node_count: 5,
          edge_count: 7,
          graph_data: `{
  "nodes": [
    {"id": "n1", "label": "Person", "properties": {"age": 30}},
    {"id": "n2", "label": "Person", "properties": {"age": 25}},
    {"id": "n3", "label": "Post", "properties": {"date": "2023-01-15"}},
    {"id": "n4", "label": "Post", "properties": {"date": "2023-02-20"}},
    {"id": "n5", "label": "Tag", "properties": {"name": "GraphDB"}}
  ],
  "edges": [
    {"source": "n1", "target": "n3", "label": "CREATED"},
    {"source": "n2", "target": "n4", "label": "CREATED"},
    {"source": "n1", "target": "n2", "label": "FOLLOWS"},
    {"source": "n3", "target": "n5", "label": "HAS_TAG"},
    {"source": "n4", "target": "n5", "label": "HAS_TAG"},
    {"source": "n2", "target": "n3", "label": "LIKED"},
    {"source": "n1", "target": "n4", "label": "LIKED"}
  ]
}`
        },
        { 
          id: 2, 
          dataset_id: 1, 
          file_path: '/data/A/query_graph_2.json', 
          file_size: 1536, // 1.5KB
          uploaded_at: '2023-05-10',
          node_count: 4,
          edge_count: 5,
          graph_data: `{
  "nodes": [
    {"id": "n1", "label": "Person", "properties": {"age": 30}},
    {"id": "n2", "label": "Person", "properties": {"age": 25}},
    {"id": "n3", "label": "Post", "properties": {"date": "2023-01-15"}},
    {"id": "n4", "label": "Tag", "properties": {"name": "GraphDB"}}
  ],
  "edges": [
    {"source": "n1", "target": "n3", "label": "CREATED"},
    {"source": "n2", "target": "n3", "label": "LIKED"},
    {"source": "n1", "target": "n2", "label": "FOLLOWS"},
    {"source": "n3", "target": "n4", "label": "HAS_TAG"},
    {"source": "n2", "target": "n4", "label": "INTERESTED_IN"}
  ]
}`
        },
        // 其他查询图添加文件大小
        { id: 3, dataset_id: 1, file_path: '/data/A/query_graph_3.json', file_size: 1792, uploaded_at: '2023-05-11' },
        { id: 4, dataset_id: 2, file_path: '/data/B/query_graph_1.json', file_size: 2560, uploaded_at: '2023-05-15' },
        { id: 5, dataset_id: 2, file_path: '/data/B/query_graph_2.json', file_size: 2304, uploaded_at: '2023-05-16' },
        { id: 6, dataset_id: 3, file_path: '/data/C/query_graph_1.json', file_size: 1280, uploaded_at: '2023-06-01' },
        { id: 7, dataset_id: 3, file_path: '/data/C/query_graph_2.json', file_size: 1408, uploaded_at: '2023-06-02' },
        { id: 8, dataset_id: 3, file_path: '/data/C/query_graph_3.json', file_size: 1664, uploaded_at: '2023-06-03' },
        { id: 9, dataset_id: 4, file_path: '/data/D/query_graph_1.json', file_size: 3072, uploaded_at: '2023-06-20' },
        { id: 10, dataset_id: 4, file_path: '/data/D/query_graph_2.json', file_size: 2816, uploaded_at: '2023-06-21' }
      ],
      // 模态框相关数据
      showModal: false,
      modalType: '', // 'dataset', 'data_graph', 'query_graph'
      selectedItem: null,
      modalTitle: ''
    }
  },
  computed: {
    filteredDataGraphs() {
      if (!this.selectedDataset) {
        return this.dataGraphs;
      }
      return this.dataGraphs.filter(graph => graph.dataset_id === parseInt(this.selectedDataset));
    },
    filteredQueryGraphs() {
      if (!this.selectedDataset) {
        return this.queryGraphs;
      }
      return this.queryGraphs.filter(graph => graph.dataset_id === parseInt(this.selectedDataset));
    }
  },
  methods: {
    getDatasetName(datasetId) {
      const dataset = this.datasets.find(ds => ds.id === datasetId);
      return dataset ? dataset.name : '未知';
    },
    viewDataset(id) {
      const dataset = this.datasets.find(ds => ds.id === id);
      if (dataset) {
        this.selectedItem = dataset;
        this.modalType = 'dataset';
        this.modalTitle = `数据集详情: ${dataset.name}`;
        this.showModal = true;
      }
    },
    viewDataGraph(id) {
      const graph = this.dataGraphs.find(g => g.id === id);
      if (graph) {
        this.selectedItem = graph;
        this.modalType = 'data_graph';
        this.modalTitle = `数据图详情: ${graph.file_path}`;
        this.showModal = true;
      }
    },
    viewQueryGraph(id) {
      const graph = this.queryGraphs.find(g => g.id === id);
      if (graph) {
        this.selectedItem = graph;
        this.modalType = 'query_graph';
        this.modalTitle = `查询图详情: ${graph.file_path}`;
        this.showModal = true;
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedItem = null;
    },
    getRelatedDataGraphs(datasetId) {
      return this.dataGraphs.filter(graph => graph.dataset_id === datasetId);
    },
    getRelatedQueryGraphs(datasetId) {
      return this.queryGraphs.filter(graph => graph.dataset_id === datasetId);
    },
    viewGraph(id) {
      console.log('查看图:', id);
      // 这个方法保留但不再使用
    },
    formatJson(jsonString) {
      try {
        // 如果已经是对象，则转为字符串再格式化
        const jsonObj = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        return JSON.stringify(jsonObj, null, 2);
      } catch (e) {
        return jsonString; // 如果解析失败，返回原始字符串
      }
    },
    getModalIcon() {
      switch(this.modalType) {
        case 'dataset':
          return ['fas', 'database'];
        case 'data_graph':
          return ['fas', 'project-diagram'];
        case 'query_graph':
          return ['fas', 'search'];
        default:
          return ['fas', 'info-circle'];
      }
    },
    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '未知';
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = bytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(2)} ${units[unitIndex]}`;
    },
    downloadGraph(id, type) {
      let graph;
      let fileName;
      
      if (type === 'data_graph') {
        graph = this.dataGraphs.find(g => g.id === id);
        fileName = graph ? graph.file_path.split('/').pop() : `data_graph_${id}.json`;
      } else if (type === 'query_graph') {
        graph = this.queryGraphs.find(g => g.id === id);
        fileName = graph ? graph.file_path.split('/').pop() : `query_graph_${id}.json`;
      }
      
      if (graph) {
        // 在实际应用中，这里应该是从服务器下载文件
        // 目前使用模拟下载
        console.log(`下载${type === 'data_graph' ? '数据图' : '查询图'}: ${id}, 文件名: ${fileName}`);
        this.$message.success(`${fileName} 开始下载`);
      }
    }
  }
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

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.tab svg {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.tab.active {
  border-bottom: 2px solid #3b82f6;
  color: #3b82f6;
}

.tab:hover:not(.active) {
  background-color: #f9fafb;
  color: #4b5563;
}

.tab-content {
  padding: 1rem 0;
}

.table-container {
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
}

.btn-view {
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-view svg {
  margin-right: 0.25rem;
}

.btn-view:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-group label {
  margin-right: 0.5rem;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.filter-group label svg {
  margin-right: 0.5rem;
  color: #6b7280;
}

.filter-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
  min-width: 120px;
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

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.modal-header h3 svg {
  margin-right: 0.5rem;
  color: #3b82f6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-content {
  padding: 1.5rem;
}

.detail-item {
  margin-bottom: 1rem;
  display: flex;
}

.detail-label {
  font-weight: 600;
  width: 120px;
  color: #4b5563;
}

.detail-value {
  flex: 1;
}

.detail-section {
  margin-top: 1.5rem;
}

.detail-section h4 {
  margin-bottom: 0.75rem;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.detail-section h4 svg {
  margin-right: 0.5rem;
  color: #3b82f6;
}

.related-items {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.related-items li {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
}

.related-items li svg {
  margin-right: 0.5rem;
  color: #6b7280;
}

.graph-preview {
  margin-top: 1.5rem;
}

.graph-placeholder {
  height: 300px;
  border: 1px dashed #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
}

.placeholder-text {
  color: #6b7280;
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-text svg {
  margin-bottom: 1rem;
  color: #d1d5db;
}

/* 新增样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.stat-icon {
  font-size: 1.25rem;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.notes-box {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 0.5rem;
  border-left: 4px solid #3b82f6;
  font-style: italic;
  color: #4b5563;
}

.item-name {
  font-weight: 500;
}

.item-meta {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.code-block {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.detail-section {
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-download {
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-download svg {
  margin-right: 0.25rem;
}

.btn-download:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
