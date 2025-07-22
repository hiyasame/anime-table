# GitHub Pages 部署指南

## 🚀 自动部署设置

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 📋 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入你的 GitHub 仓库
   - 点击 `Settings` 标签页
   - 在左侧菜单中找到 `Pages`
   - 在 `Source` 部分选择 `GitHub Actions`

3. **等待部署完成**
   - 推送代码后，GitHub Actions 会自动开始构建和部署
   - 可以在 `Actions` 标签页查看部署进度
   - 部署完成后，你的网站将在 `https://你的用户名.github.io/anime-table/` 可用

### 🔧 配置说明

#### GitHub Actions 工作流 (`.github/workflows/deploy.yml`)
- **触发条件**: 推送到 `main` 分支时自动触发
- **手动触发**: 支持在 Actions 页面手动触发部署
- **构建环境**: Ubuntu 最新版本，Node.js 18
- **部署目标**: GitHub Pages

#### Vite 配置修改
- **开发环境**: `base: '/'`
- **生产环境**: `base: '/anime-table/'` (匹配 GitHub Pages 路径)

### 🌐 访问地址

部署成功后，你的应用将在以下地址可用：
```
https://你的GitHub用户名.github.io/anime-table/?username=bangumi用户名
```

例如：
```
https://yourusername.github.io/anime-table/?username=sai
```

### 🔄 更新部署

每次推送到 `main` 分支时，GitHub Actions 会自动重新构建和部署：

```bash
git add .
git commit -m "Update features"
git push origin main
```

### 🛠️ 故障排除

1. **部署失败**
   - 检查 Actions 页面的错误日志
   - 确保 `package.json` 中的依赖版本正确
   - 确保没有语法错误

2. **页面无法访问**
   - 确保 GitHub Pages 已启用
   - 检查仓库是否为公开仓库
   - 等待几分钟让 DNS 生效

3. **资源加载失败**
   - 检查 `vite.config.js` 中的 `base` 配置
   - 确保路径与仓库名称匹配

### 📝 注意事项

- **仓库名称**: 如果你的仓库名不是 `anime-table`，需要修改 `vite.config.js` 中的 base 路径
- **分支名称**: 默认部署 `main` 分支，如果使用其他分支需要修改工作流配置
- **CORS 问题**: 生产环境直接访问 Bangumi API，可能遇到 CORS 限制
- **API 限制**: 请遵守 Bangumi API 的使用条款和频率限制
