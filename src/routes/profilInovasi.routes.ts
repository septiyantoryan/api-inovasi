import { Router, IRouter } from 'express';
import {
    createProfilInovasi,
    getAllProfilInovasi,
    getProfilInovasiById,
    updateProfilInovasi,
    deleteProfilInovasi
} from '../controllers/profilInovasi.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router: IRouter = Router();


router.get('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getAllProfilInovasi);
router.get('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), getProfilInovasiById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'OPD']), createProfilInovasi);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'OPD']), updateProfilInovasi);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), deleteProfilInovasi);

export default router;
