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

const router: IRouter = Router();

// CRUD routes for Indikator Inovasi with specific role-based authentication

// GET routes - accessible by both ADMIN and OPD
router.get('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getAllIndikatorInovasi);
router.get('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getIndikatorInovasiById);
router.get('/profil/:profilInovasiId', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getIndikatorInovasiByProfilId);

// CREATE and UPDATE routes - accessible by both ADMIN and OPD
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), createIndikatorInovasi);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), updateIndikatorInovasi);

// DELETE routes - only accessible by ADMIN
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), deleteIndikatorInovasi);

export default router;
