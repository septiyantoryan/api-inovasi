import { Router, IRouter } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema, updateProfileSchema } from '../validations/auth.validation';

const router: IRouter = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getProfile);
router.patch('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(updateProfileSchema), updateProfile);

export default router;
