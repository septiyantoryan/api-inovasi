import { Router, IRouter } from 'express';
import { testCheck, welcome } from '../controllers/test.controller';
import authRoutes from './auth.routes';
import profilInovasiRoutes from './profilInovasi.routes';

const router: IRouter = Router();

// Auth routes
router.use('/auth', authRoutes);

// Profil Inovasi routes
router.use('/profil-inovasi', profilInovasiRoutes);

// Test endpoint
router.get('/test', testCheck);

// Welcome endpoint
router.get('/', welcome);

export default router;
