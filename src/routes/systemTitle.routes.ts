import { Router } from 'express'
import { systemTitleController } from '../controllers/systemTitle.controller'
import { authenticateToken } from '../middleware/auth'
import { validate } from '../middleware/validation'
import {
    createSystemTitleSchema,
    updateSystemTitleSchema,
    systemTitleQuerySchema
} from '../validations/systemTitle.validation'

const router: Router = Router()

// Public routes (no authentication required)
router.get('/active', systemTitleController.getActive)

// Protected routes (authentication required)
router.use(authenticateToken)

// Get all system titles
router.get('/', systemTitleController.getAll)

// Get system title by ID
router.get('/:id', systemTitleController.getById)

// Create new system title
router.post(
    '/',
    validate(createSystemTitleSchema),
    systemTitleController.create
)

// Update system title
router.patch(
    '/:id',
    validate(updateSystemTitleSchema),
    systemTitleController.update
)

// Delete system title
router.delete('/:id', systemTitleController.delete)

// Toggle active status
router.patch('/:id/toggle-active', systemTitleController.toggleActive)

export default router
