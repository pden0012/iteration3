// Deployment server for hayfree.space
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

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

// Iteration 2 static files and routes (located in parent directory)
const iteration2Path = path.join(__dirname, '..', 'iteration 2', 'dist');
const iteration2ImagesPath = path.join(__dirname, '..', 'iteration 2', 'images copy');
app.use('/iteration2', express.static(iteration2Path));
app.use('/iteration2/images', express.static(iteration2ImagesPath));
// Handle typos like "/iteration 2" or encoded forms, redirect to standard path
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

// Iteration 3 static files and routes (current directory)
const iteration3Path = path.join(__dirname, 'dist');
const iteration3ImagesPath = path.join(__dirname, 'images');
const iteration3NestedImagesPath = path.join(iteration3ImagesPath, 'iteration 3 images');
app.use('/iteration3', express.static(iteration3Path));
app.use('/iteration3/images', express.static(iteration3ImagesPath));
// Unified root-level image paths, compatible with /images/ references in code
app.use('/images', express.static(iteration3ImagesPath));
// Compatible with PlayGame paths like /images/Game Plants/..., /images/GIF/... etc
app.use('/images', express.static(iteration3NestedImagesPath));
app.use('/images', express.static(iteration2ImagesPath));
// Main directory images (for image.png and other main images)
const mainImagesPath = path.join(__dirname, '..', 'images');
app.use('/images', express.static(mainImagesPath));
app.get('/iteration3', (req, res) => {
  res.sendFile(path.join(iteration3Path, 'index.html'));
});
app.get(/^\/iteration3\/.*/, (req, res) => {
  res.sendFile(path.join(iteration3Path, 'index.html'));
});

// Iteration 1 static files and routes (located in parent directory)
const iteration1Path = path.join(__dirname, '..', 'iteration 1', 'dist');
app.use('/iteration1', express.static(iteration1Path));
app.get('/iteration1', (req, res) => {
  res.sendFile(path.join(iteration1Path, 'index.html'));
});
app.get(/^\/iteration1\/.*/, (req, res) => {
  res.sendFile(path.join(iteration1Path, 'index.html'));
});

// Root path - directly serve iteration3 homepage without changing address bar
app.get('/', (req, res) => {
  res.sendFile(path.join(iteration3Path, 'index.html'));
});

// Municipal boundary CSV - support both hyphen and underscore filenames and multiple locations
const municipalCandidates = [
  path.join(iteration3Path, 'municipal-boundary.csv'),
  path.join(iteration3Path, 'municipal_boundary.csv'),
  path.join(iteration2Path, 'municipal-boundary.csv'),
  path.join(iteration2Path, 'municipal_boundary.csv'),
  path.join(__dirname, 'municipal-boundary.csv'),
  path.join(__dirname, 'municipal_boundary.csv'),
  // repository root (parent directory of iteration 3)
  path.join(__dirname, '..', 'municipal-boundary.csv'),
  path.join(__dirname, '..', 'municipal_boundary.csv')
];
app.get(['/municipal-boundary.csv', '/municipal_boundary.csv'], (req, res) => {
  for (const candidate of municipalCandidates) {
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }
  }
  res.status(404).send('municipal boundary csv not found');
});

// Address CSV for dashboard search suggestions - serve from main directory
const addressCandidates = [
  path.join(__dirname, '..', 'address', 'address.csv'),
  path.join(iteration3Path, 'address', 'address.csv'),
  path.join(iteration2Path, 'address', 'address.csv'),
  path.join(__dirname, 'address', 'address.csv')
];
app.get('/address/address.csv', (req, res) => {
  for (const candidate of addressCandidates) {
    if (fs.existsSync(candidate)) {
      return res.sendFile(candidate);
    }
  }
  res.status(404).send('address csv not found');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Iteration 2: http://hayfree.space/iteration2`);
  console.log(`📍 Iteration 3: http://hayfree.space/iteration3`);
});

