import { Router, IRouter } from 'express';
import { testCheck, welcome } from '../controllers/test.controller';

const router: IRouter = Router();

// Test endpoint
router.get('/test', testCheck);

// Welcome endpoint
router.get('/', welcome);

export default router;
