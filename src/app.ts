// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';
dotenv.config({ path: envFile });
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import connectDB from './config/db';





const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB -
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Serve client build
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use('/client', express.static(clientBuildPath));
  app.get('/client/*', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Serve admin build
const adminBuildPath = path.join(__dirname, '../admin-panel/dist');
if (fs.existsSync(adminBuildPath)) {
  app.use('/admin', express.static(adminBuildPath));
  app.get('/admin/*', (_, res) => {
    res.sendFile(path.join(adminBuildPath, 'index.html'));
  });
}




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('🛑 MongoDB disconnected');
  process.exit(0);
});
