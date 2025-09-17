import { Router, IRouter } from 'express';
import {
    createProfilInovasi,
    getAllProfilInovasi,
    getPublicProfilInovasi,
    getProfilInovasiById,
    updateProfilInovasi,
    deleteProfilInovasi
} from '../controllers/profilInovasi.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
    createProfilInovasiSchema,
    updateProfilInovasiSchema,
    profilInovasiParamsSchema
} from '../validations/profilInovasi.validation';

const router: IRouter = Router();

// Public route for viewing profil inovasi (no authentication required)
router.get('/public', getPublicProfilInovasi);

router.get('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getAllProfilInovasi);
router.get('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(profilInovasiParamsSchema), getProfilInovasiById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(createProfilInovasiSchema), createProfilInovasi);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(profilInovasiParamsSchema), validate(updateProfilInovasiSchema), updateProfilInovasi);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), validate(profilInovasiParamsSchema), deleteProfilInovasi);

export default router;
