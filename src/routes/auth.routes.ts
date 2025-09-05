import { Router, IRouter } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router: IRouter = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
