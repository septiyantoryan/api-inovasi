import { Router } from 'express'
import { carouselController } from '../controllers/carousel.controller'
import { authenticateToken } from '../middleware/auth'
import { carouselUpload } from '../middleware/carouselUpload'
import { validate } from '../middleware/validation'
import {
    createCarouselSchema,
    updateCarouselSchema,
    updateSortOrderSchema
} from '../validations/carousel.validation'

const router: Router = Router()

// Public routes (no authentication required)
router.get('/active', carouselController.getActive)

// Protected routes (authentication required)
router.use(authenticateToken)

// Get all carousel images
router.get('/', carouselController.getAll)

// Get carousel image by ID
router.get('/:id', carouselController.getById)

// Create new carousel image
router.post(
    '/',
    carouselUpload.single('image'),
    validate(createCarouselSchema),
    carouselController.create
)

// Update carousel image
router.patch(
    '/:id',
    carouselUpload.single('image'),
    validate(updateCarouselSchema),
    carouselController.update
)

// Delete carousel image
router.delete('/:id', carouselController.delete)

// Update sort order of multiple images
router.patch(
    '/sort-order/update',
    validate(updateSortOrderSchema),
    carouselController.updateSortOrder
)

// Toggle active status
router.patch('/:id/toggle-active', carouselController.toggleActive)

export default router