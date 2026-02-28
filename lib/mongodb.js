import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;

/**
 * Mongoose setup for models
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGO_URI) {
        console.warn('MONGO_URI is not defined. Skipping database connection (expected during build).');
        return null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            connectTimeoutMS: 10000, // 10s timeout
            serverSelectionTimeoutMS: 10000,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            console.log('=> MongoDB Connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error('=> MongoDB Connection Error:', e.message);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

/**
 * MongoDB Client setup for NextAuth adapter
 */
const options = {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
};
let client;
let clientPromise;

if (!MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('CRITICAL: MONGO_URI is not defined. Please add it to Vercel Environment Variables.');
    }
    // Fallback for build phase to prevent crash
    console.warn('MONGO_URI is not defined. Using mock client promise for build phase.');
    clientPromise = Promise.resolve(null);
} else {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(MONGO_URI, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(MONGO_URI, options);
        clientPromise = client.connect();
    }
}

export { clientPromise };
export default dbConnect;
