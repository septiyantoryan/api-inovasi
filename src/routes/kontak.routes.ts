import { Router, IRouter } from 'express';
import { KontakController } from '../controllers/kontak.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { kontakValidation, updateKontakValidation } from '../validations';

const router: IRouter = Router();

// Public routes - untuk mengakses data kontak
router.get('/', KontakController.getAllKontak);
router.get('/:id', KontakController.getKontakById);

// Admin routes - untuk mengelola data kontak (memerlukan authentication)
router.post('/',
    authenticateToken,
    validate(kontakValidation),
    KontakController.createKontak
);

router.put('/:id',
    authenticateToken,
    validate(updateKontakValidation),
    KontakController.updateKontak
);

router.delete('/:id',
    authenticateToken,
    KontakController.deleteKontak
);

export default router;