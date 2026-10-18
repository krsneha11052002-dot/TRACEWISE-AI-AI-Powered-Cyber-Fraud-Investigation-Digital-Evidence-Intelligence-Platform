// TRACEWISE AI - Database Configuration
// Connects to MongoDB Atlas only if MONGODB_URI is configured.
// Gracefully falls back to high-speed in-memory store for demo / offline use.

import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('YOUR_MONGODB_ATLAS_URI')) {
    console.log('ℹ️ [TRACEWISE DB] MONGODB_URI not configured. Operating in High-Speed In-Memory Demo Storage Mode.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ [TRACEWISE DB] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [TRACEWISE DB] MongoDB Atlas Connection failed (${error.message}). Falling back to In-Memory Demo Storage.`);
    isConnected = false;
    return false;
  }
}

export function isMongoConnected() {
  return isConnected;
}
