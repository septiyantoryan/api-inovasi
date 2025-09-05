import { Router, IRouter } from 'express';
import { testCheck } from '../controllers/test.controller';

const router: IRouter = Router();

// Test endpoint
router.get('/', testCheck);

export default router;
