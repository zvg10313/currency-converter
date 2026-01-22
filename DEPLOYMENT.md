# 部署到 GitHub Pages

本项目已改造为纯前端应用，可以部署到 GitHub Pages。

## 部署步骤

### 1. 推送代码到 GitHub

确保你的仓库名称为 `currency-converter`（如果不同，需要修改 [vite.config.ts](file:///Users/kay/Documents/GitHub/currency-converter/vite.config.ts#L7) 中的 `base` 路径）。

### 2. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **Pages**
3. 在 **Build and deployment** 下：
   - Source: 选择 **GitHub Actions**

### 3. 推送代码触发部署

将代码推送到 `main` 分支，GitHub Actions 会自动构建并部署。

```bash
git add .
git commit -m "Update for GitHub Pages deployment"
git push origin main
```

### 4. 访问应用

部署完成后，访问：
```
https://your-username.github.io/currency-converter/
```

## 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build:client
```

## 注意事项

- 如果仓库名不是 `currency-converter`，需要修改 [vite.config.ts](file:///Users/kay/Documents/GitHub/currency-converter/vite.config.ts#L7) 中的 `base` 配置
- 历史记录使用 `localStorage` 存储，数据保存在浏览器本地
- 无需后端服务器或数据库
