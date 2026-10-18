import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import casesRouter from './routes/cases.js';
import evidenceRouter from './routes/evidence.js';
import timelineRouter from './routes/timeline.js';
import urlAnalyzerRouter from './routes/urlAnalyzer.js';
import reportsRouter from './routes/reports.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (MongoDB Atlas if MONGODB_URI set, else graceful in-memory demo mode)
connectDB();

// Global Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logger for investigative audit
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  if (req.path !== '/api/health') {
    console.log(`[${timestamp}] [TRACEWISE-API] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api/cases', casesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/url-analyzer', urlAnalyzerRouter);
app.use('/api', reportsRouter);

// System Health & Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'TRACEWISE AI Forensic Intelligence Backend',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: process.env.MONGODB_URI ? 'MongoDB Atlas (Configured)' : 'In-Memory Secure Store (Zero-Cloud Mode)',
    sha256Verification: 'Enabled (WebCrypto / NodeCrypto)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Production Static Serving for Render Single-Container Deployment
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`[TRACEWISE-API] Serving static production build from ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for React Client routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif; background:#0B1120; color:#F8FAFC; padding:40px; border-radius:12px; margin:40px auto; max-width:600px; border:1px solid #1E293B;">
        <h2 style="color:#38BDF8;">TRACEWISE AI &mdash; Cyber Fraud Forensic API</h2>
        <p style="color:#94A3B8;">Backend service is running successfully on port ${PORT}.</p>
        <p>API Health Check: <a href="/api/health" style="color:#00F0FF;">/api/health</a></p>
        <p>Cases Endpoint: <a href="/api/cases" style="color:#00F0FF;">/api/cases</a></p>
        <p style="font-size:12px; color:#64748B;">For full GUI, run the Vite frontend development server or build with <code>npm run build</code>.</p>
      </div>
    `);
  });
}

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'ENDPOINT_NOT_FOUND',
    message: `API endpoint ${req.originalUrl} does not exist.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[TRACEWISE-API ERROR]', err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred during investigation data processing.'
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[TRACEWISE-API] Server running at http://localhost:${PORT}`);
  console.log(`[TRACEWISE-API] Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful Termination
process.on('SIGTERM', () => {
  console.log('[TRACEWISE-API] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[TRACEWISE-API] Process terminated.');
  });
});

export default app;
