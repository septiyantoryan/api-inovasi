import { Router, IRouter } from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/auth.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validations/auth.validation';

const router: IRouter = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getProfile);
router.patch('/profile', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(updateProfileSchema), updateProfile);
router.patch('/change-password', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(changePasswordSchema), changePassword);

export default router;
