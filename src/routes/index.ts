import { Router, IRouter } from 'express';
import { testCheck, welcome } from '../controllers/test.controller';
import authRoutes from './auth.routes';
import profilInovasiRoutes from './profilInovasi.routes';
import indikatorInovasiRoutes from './indikatorInovasi.routes';
import userRoutes from './user.routes';

const router: IRouter = Router();

// Auth routes
router.use('/auth', authRoutes);

// User management routes
router.use('/users', userRoutes);

// Profil Inovasi routes
router.use('/profil-inovasi', profilInovasiRoutes);

// Indikator Inovasi routes
router.use('/indikator-inovasi', indikatorInovasiRoutes);

// Test endpoint
router.get('/test', testCheck);

// Welcome endpoint
router.get('/', welcome);

export default router;
