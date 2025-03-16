import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

// Proxy API requests to Flowscale
app.use('/api', createProxyMiddleware({
  target: process.env.API_BASE_URL || 'https://f800d30f62bd4fb6ae0e5212cb8b2995.pod.flowscale.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v1',
  },
  onProxyReq: (proxyReq) => {
    // Add API key from environment variable
    if (process.env.API_KEY) {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.API_KEY}`);
    }
  }
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});