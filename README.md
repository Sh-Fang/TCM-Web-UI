# 图数据库子图匹配可视化系统

<div align="center">

![TCM](https://img.shields.io/badge/TCMatch-Main-red)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![G6](https://img.shields.io/badge/AntV-G6-blue)
![License](https://img.shields.io/badge/License-MIT-blue)

一个基于 Vue.js 和 AntV G6 开发的图数据可视化系统，支持数据图和查询图的文件上传与可视化展示，时序子图匹配模块与 [TCMatch](https://github.com/Sh-Fang/TCMatch) 对接。


</div>

## 📸 系统界面展示

### 登录界面
![login](/src/assets/images/login.png)

### 注册界面
### 登录界面
![register](/src/assets/images/register.png)


### 个人信息界面
![profile](/src/assets/images/profile.png)

### 设置界面
![setting](/src/assets/images/setting.png)


### 数据图可视化
![graph-visualization](/src/assets/images/graph-visualization.png)

### 图分析
![graph-analysis](/src/assets/images/graph-analysis.png)

### 子图匹配
![subgraph-matching-1](/src/assets/images/subgraph-matching-1.png)


### 匹配结果
![subgraph-matching-2](/src/assets/images/subgraph-matching-2.png)

### 数据库数据
![db](/src/assets/images/db.png)

![db-1](/src/assets/images/db-1.png)

![db-2](/src/assets/images/db-2.png)


### 数据信息
![db-info](/src/assets/images/db-info.png)


## ✨ 核心功能

### 1. 文件处理
- 支持 .txt 格式的图数据文件上传
- 严格的文件格式校验
- 实时的错误提示和状态反馈
- 文件解析进度展示

### 2. 可视化功能
- 基于 AntV G6 的图形渲染
- 自适应画布大小
- 节点和边的样式定制
- 图形自动布局

### 3. 用户交互
- 简洁的文件选择界面
- 实时的加载状态提示
- Toast 风格的错误提示
- 流畅的标签页切换

## 🚀 快速开始

### 环境要求
- Node.js 16.x 或更高版本
- npm 7.x 或更高版本

### 安装与运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 📦 项目结构

```
src/
├── router/            # 路由配置
├── store/            # Vuex状态管理
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.js          # 入口文件
```

## 📄 许可证

本项目采用 MIT 许可证

## 📝 使用说明

### 数据图文件格式
```
[源节点ID] [目标节点ID] [边标签] [源节点标签] [目标节点标签] [时间戳]
```
[在这里放置数据图文件示例截图]

注意事项：
- 每行必须包含6个字段
- 所有字段不能为空
- 默认只处理前100行数据
- 自动过滤没有连接的孤立节点

### 查询图文件格式
```
e [查询ID] [源节点ID] [目标节点ID] [边标签] [源节点标签] [目标节点标签]
```
[在这里放置查询图文件示例截图]

注意事项：
- 每行必须以'e'开头
- 每行必须包含7个字段
- 所有字段不能为空


## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- Oasis - [@Sh-Fang](https://github.com/Sh-Fang)


---

<div align="center">
如果这个项目对您有帮助，欢迎 Star ⭐
</div>
