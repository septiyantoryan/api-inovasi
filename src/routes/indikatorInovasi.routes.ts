import { Router, IRouter } from 'express';
import {
    createIndikatorInovasi,
    getAllIndikatorInovasi,
    getIndikatorInovasiById,
    getIndikatorInovasiByProfilId,
    updateIndikatorInovasi,
    deleteIndikatorInovasi
} from '../controllers/indikatorInovasi.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { uploadIndikatorMiddleware } from '../middleware/upload';
import { validate } from '../middleware/validation';
import {
    createIndikatorInovasiSchema,
    updateIndikatorInovasiSchema,
    indikatorInovasiParamsSchema,
    indikatorInovasiProfilParamsSchema,
    indikatorInovasiQuerySchema
} from '../validations/indikatorInovasi.validation';

const router: IRouter = Router();

// CRUD routes for Indikator Inovasi with specific role-based authentication

// GET routes - accessible by both ADMIN and OPD
router.get('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(indikatorInovasiQuerySchema), getAllIndikatorInovasi);
router.get('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(indikatorInovasiParamsSchema), getIndikatorInovasiById);
router.get('/profil/:profilInovasiId', authenticateToken, authorizeRole(['ADMIN', 'OPD']), validate(indikatorInovasiProfilParamsSchema), getIndikatorInovasiByProfilId);

// CREATE and UPDATE routes - accessible by both ADMIN and OPD
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), uploadIndikatorMiddleware, createIndikatorInovasi);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), uploadIndikatorMiddleware, validate(indikatorInovasiParamsSchema), updateIndikatorInovasi);

// DELETE routes - only accessible by ADMIN
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), validate(indikatorInovasiParamsSchema), deleteIndikatorInovasi);

export default router;
