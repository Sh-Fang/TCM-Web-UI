// src/composables/useFileLoader.js
import { ref } from "vue";

export function useFileLoader() {
    const nodes = ref(new Map()); // 用 Map 避免重复节点
    const edges = ref([]);

    function loadFile(event) {
        return new Promise((resolve, reject) => {
            const file = event.target.files[0];

            if (!file) {
                reject(new Error("未选择文件"));
                return;
            }
            if (file.type !== "text/plain") {
                reject(new Error("文件类型必须是 .txt"));
                return;
            }

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                try {
                    const lines = reader.result.split("\n").map(line => line.trim()).filter(line => line);

                    nodes.value.clear();
                    edges.value = [];

                    for (let line of lines) {
                        const fields = line.split(/\s+/); // 以空白字符分割
                        if (fields.length !== 6 || fields.some(field => field === "")) {
                            reject(new Error(`数据格式错误: 每行应包含6个字段，但找到 ${fields.length} 个。行内容: "${line}"`));
                            return;
                        }

                        const [sourceId, targetId, edgeLabel, sourceLabel, targetLabel, timestamp] = fields;

                        // 添加节点（去重）
                        if (!nodes.value.has(sourceId)) {
                            nodes.value.set(sourceId, { id: sourceId, label: sourceLabel });
                        }
                        if (!nodes.value.has(targetId)) {
                            nodes.value.set(targetId, { id: targetId, label: targetLabel });
                        }

                        // 添加边
                        edges.value.push({
                            source: sourceId,
                            target: targetId,
                            label: edgeLabel,
                            timestamp: timestamp
                        });
                    }

                    // 转换 Map 为数组
                    nodes.value = Array.from(nodes.value.values());

                    resolve({ nodes: nodes.value, edges: edges.value });
                } catch (error) {
                    reject(new Error("文件解析失败：" + error.message));
                }
            };

            reader.onerror = (error) => reject(new Error("文件读取错误：" + error.message));
        });
    }

    return {
        nodes,
        edges,
        loadFile,
    };
}
