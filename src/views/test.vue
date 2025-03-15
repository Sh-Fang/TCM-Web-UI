<template>
    <div id="data-graph-container"></div>
  </template>
  
  <script>
  export default {
    name: 'GraphVisualization',
    mounted() {
      this.initGraph();
    },
    methods: {
      initGraph() {
        const data = {
          nodes: [
            { id: 'node1', label: 'Node 1', x: 150, y: 150 },
            { id: 'node2', label: 'Node 2', x: 400, y: 150 }
          ],
          edges: [{ source: 'node1', target: 'node2' }]
        };
  
        // 确保 G6 已经加载
        if (window.G6) {
          this.graph = new window.G6.Graph({
            container: 'data-graph-container',
            width: 800,
            height: 600,
            defaultNode: {
              shape: 'circle',
              size: [100],
              color: '#5B8FF9',
              style: {
                fill: '#9EC9FF',
                lineWidth: 3
              },
              labelCfg: {
                style: {
                  fill: '#fff',
                  fontSize: 20
                }
              }
            },
            defaultEdge: {
              style: {
                stroke: '#e2e2e2'
              }
            }
          });
  
          this.graph.data(data);
          this.graph.render();
        } else {
          console.error('G6 is not loaded!');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  #data-graph-container {
    width: 800px;
    height: 600px;
  }
  </style>
  