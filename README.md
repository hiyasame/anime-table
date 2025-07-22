# 每周追番时间表

一个基于 Bangumi API 的每周追番时间表应用，使用 Vite + React + TailwindCSS 构建。

## 功能特性

- 📅 显示用户本季度想看/在看/看过的番剧的每周时间表
- 👤 显示用户基本信息和头像
- 📊 统计用户追番数量和活跃天数
- 🎨 现代化的响应式设计
- 🔗 支持通过 URL 参数指定用户名
- 📱 适配移动端和桌面端
- 🖼️ 适合嵌入到 iframe 中使用
- 🏷️ 区分想看/在看/看过状态，用不同颜色标识

## 使用方法

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中访问：
```
http://localhost:3000?username=your_bangumi_username
```

### 生产环境

1. 构建项目：
```bash
npm run build
```

2. 预览构建结果：
```bash
npm run preview
```

### GitHub Pages 部署

本项目支持一键部署到 GitHub Pages：

1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages (Source: GitHub Actions)
3. 每次推送到 `main` 分支时自动部署

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## URL 参数

- `username` 或 `user`: Bangumi 用户名（必需）

示例：
- `?username=sai`
- `?user=sai`

## iframe 嵌入

可以将此应用嵌入到其他网页中：

```html
<iframe
  src="https://your-domain.com?username=sai"
  width="100%"
  height="800"
  frameborder="0">
</iframe>
```

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: TailwindCSS
- **HTTP 客户端**: Axios
- **数据来源**: Bangumi API

## 实现逻辑

1. **获取用户收藏**: 通过 `/user/{username}/collections?subject_type=2` API 获取用户的想看(1)、在看(3)、看过(2)的番剧列表
2. **筛选当前季度**: 直接从收藏数据中根据番剧的 `date` 字段判断是否为当前季度的番剧
3. **按星期分组**: 根据播出日期计算星期几，将番剧按周一到周日分组
4. **生成时间表**: 构建最终的每周时间表数据结构

## API 说明

本应用使用 Bangumi 官方 API：
- 用户信息: `/user/{username}`
- 用户收藏: `/user/{username}/collections?subject_type=2`

## 注意事项

- 请遵守 Bangumi API 的使用条款
- 本工具仅供个人使用
- 由于 CORS 限制，可能需要配置代理或使用 CORS 代理服务
- 建议合理控制 API 请求频率

## 许可证

MIT License
