import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    toggleUserStatus,
    getUserStats
} from '../controllers/user.controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    getUsersQuerySchema
} from '../validations/user.validation';

const router: ExpressRouter = Router();

// Get user statistics (Admin only)
router.get('/stats',
    authenticateToken,
    authorizeRole(['ADMIN']),
    getUserStats
);

// Get all users with pagination and filters (Admin only)
router.get('/',
    authenticateToken,
    authorizeRole(['ADMIN']),
    // validate(getUsersQuerySchema), // Temporarily disabled for debugging
    getUsers
);

// Get user by ID (Admin only)
router.get('/:id',
    authenticateToken,
    authorizeRole(['ADMIN']),
    getUserById
);

// Create new user (Admin only)
router.post('/',
    authenticateToken,
    authorizeRole(['ADMIN']),
    validate(createUserSchema),
    createUser
);

// Update user (Admin only)
router.put('/:id',
    authenticateToken,
    authorizeRole(['ADMIN']),
    validate(updateUserSchema),
    updateUser
);

// Change user password (Admin only)
router.patch('/:id/password',
    authenticateToken,
    authorizeRole(['ADMIN']),
    validate(changePasswordSchema),
    changeUserPassword
);

// Toggle user status (Admin only)
router.patch('/:id/toggle-status',
    authenticateToken,
    authorizeRole(['ADMIN']),
    toggleUserStatus
);

// Delete user (Admin only)
router.delete('/:id',
    authenticateToken,
    authorizeRole(['ADMIN']),
    deleteUser
);

export default router;
