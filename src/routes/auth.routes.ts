import { Router, IRouter } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router: IRouter = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getProfile);
router.patch('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), updateProfile);

export default router;
