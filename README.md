# Dieleme (叠乐买) - 殡葬服务平台

## 项目简介
Dieleme 是一个专业的殡葬服务平台，致力于提供庄重、透明、便捷的殡仪馆查询与费用估算服务。

## 功能特性
- **实时定位与搜索**：集成高德地图 API，实时显示附近的殡仪馆。
- **费用透明化**：提供服务项目费用预估，生成清晰的价格清单。
- **紧急联系**：一键呼叫与快速表单，确保紧急情况下能迅速获得帮助。
- **移动端优化**：针对手机端优化的抽屉式交互与暗色模式设计。

## 部署指南 (Vercel)

本项目已针对 Vercel 部署进行了优化。

### 1. 导入项目
在 Vercel 控制台点击 "Add New..." -> "Project"，选择您的 GitHub 仓库 (`dieleme`)。

### 2. 配置环境变量
在部署页面的 **Environment Variables** 区域，添加以下变量（如果在高德开放平台申请了 Key）：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 JS API Key | `your_key_here` |
| `NEXT_PUBLIC_AMAP_SECURITY_CODE` | 高德地图安全密钥 | `your_security_code_here` |

> **注意**：如果不配置这些变量，项目将自动运行在 **演示模式 (Demo Mode)**，使用模拟数据（上海地区）。

### 3. 部署
点击 **Deploy** 按钮。Vercel 将自动检测 Next.js 框架并完成构建。

## 本地开发

1. 克隆仓库
2. 安装依赖: `npm install`
3. 配置环境: 复制 `.env.example` 为 `.env.local` 并填入 Key。
4. 启动: `npm run dev`
