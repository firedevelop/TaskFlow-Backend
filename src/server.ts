import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors(corsConfig));

// Morgan
app.use(morgan('dev'));

// Habilitar lectura de datos de tipo JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app;