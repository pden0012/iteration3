// 部署服务器 - 用于 hayfree.space
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Proxy
app.use('/api', createProxyMiddleware({
  target: 'http://15.134.34.242:8080',
  changeOrigin: true,
  timeout: 90000,
  proxyTimeout: 90000,
  pathRewrite: { '^/api': '' },
  onError: (err, req, res) => {
    console.error('🚨 API Proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ 
        error: 'Backend API error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}));

// Iteration 2 静态文件和路由（位于上级目录）
const iteration2Path = path.join(__dirname, '..', 'iteration 2', 'dist');
const iteration2ImagesPath = path.join(__dirname, '..', 'iteration 2', 'images copy');
app.use('/iteration2', express.static(iteration2Path));
app.use('/iteration2/images', express.static(iteration2ImagesPath));
// 兼容误输入的 "/iteration 2" 或编码形式，统一重定向到标准路径
app.use((req, res, next) => {
  if (req.path.startsWith('/iteration 2') || req.path.startsWith('/iteration%202')) {
    const normalized = req.originalUrl.replace(/iteration%202|iteration 2/g, 'iteration2');
    return res.redirect(301, normalized);
  }
  next();
});
app.get('/iteration2', (req, res) => {
  res.sendFile(path.join(iteration2Path, 'index.html'));
});
app.get(/^\/iteration2\/.*/, (req, res) => {
  res.sendFile(path.join(iteration2Path, 'index.html'));
});

// Iteration 3 静态文件和路由（当前目录）
const iteration3Path = path.join(__dirname, 'dist');
const iteration3ImagesPath = path.join(__dirname, 'images');
app.use('/iteration3', express.static(iteration3Path));
app.use('/iteration3/images', express.static(iteration3ImagesPath));
// 统一根级图片路径，兼容代码里使用的 /images/ 引用
app.use('/images', express.static(iteration3ImagesPath));
app.use('/images', express.static(iteration2ImagesPath));
app.get('/iteration3', (req, res) => {
  res.sendFile(path.join(iteration3Path, 'index.html'));
});
app.get(/^\/iteration3\/.*/, (req, res) => {
  res.sendFile(path.join(iteration3Path, 'index.html'));
});

// 根路径 - 可以重定向到默认的 iteration
app.get('/', (req, res) => {
  res.redirect('/iteration3');  // 或者显示一个选择页面
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Iteration 2: http://hayfree.space/iteration2`);
  console.log(`📍 Iteration 3: http://hayfree.space/iteration3`);
});

