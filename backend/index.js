import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import chatbotRoutes from './routes/chatbot.js';

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Enable __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve image files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chatbot', chatbotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
