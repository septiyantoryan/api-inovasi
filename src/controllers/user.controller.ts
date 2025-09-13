import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import {
    CreateUserInput,
    UpdateUserInput,
    ChangePasswordInput,
    GetUsersQuery
} from '../validations/user.validation';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
    body: any;
    query: any;
}

interface UserResponse {
    id: string;
    username: string;
    nama: string;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        profilInovasi: number;
    };
}

// Get all users with pagination, search, and filters
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Parse query parameters with safe defaults
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
        const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
        const role = req.query.role as string;
        const status = req.query.status as string;
        const sortBy = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'desc';

        // Validate sortBy field
        const validSortFields = ['username', 'nama', 'role', 'status', 'createdAt'];
        const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        // Validate sortOrder
        const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder as 'asc' | 'desc' : 'desc';

        // Build where clause for filtering
        const where: any = {};

        // Search filter
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { nama: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Role filter
        if (role && ['ADMIN', 'OPD'].includes(role)) {
            where.role = role;
        }

        // Status filter
        if (status && ['AKTIF', 'TIDAK_AKTIF'].includes(status)) {
            where.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get users with count
        const [users, totalUsers] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    nama: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            profilInovasi: true
                        }
                    }
                },
                orderBy: {
                    [validSortBy]: validSortOrder
                },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            success: true,
            message: 'Data pengguna berhasil diambil',
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error getting users:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data pengguna',
            error: process.env.NODE_ENV === 'development' ? {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            } : undefined
        });
    }
};

// Get user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        profilInovasi: true
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Data pengguna berhasil diambil',
            data: user
        });
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Create new user
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, password, nama, role } = req.body as CreateUserInput;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Username sudah terdaftar'
            });
            return;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                nama,
                role
            },
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Pengguna berhasil dibuat',
            data: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat membuat pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Update user
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body as UpdateUserInput;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        // Check if username is being updated and already exists
        if (updateData.username && updateData.username !== existingUser.username) {
            const usernameExists = await prisma.user.findUnique({
                where: { username: updateData.username }
            });

            if (usernameExists) {
                res.status(400).json({
                    success: false,
                    message: 'Username sudah terdaftar'
                });
                return;
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Pengguna berhasil diperbarui',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat memperbarui pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Delete user (soft delete by setting status to TIDAK_AKTIF)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        profilInovasi: true
                    }
                }
            }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        // Prevent deletion of current user
        if (req.user?.userId === id) {
            res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus akun sendiri'
            });
            return;
        }

        // Check if user has associated data
        if (existingUser._count.profilInovasi > 0) {
            // Soft delete - set status to TIDAK_AKTIF
            const deletedUser = await prisma.user.update({
                where: { id },
                data: { status: 'TIDAK_AKTIF' },
                select: {
                    id: true,
                    username: true,
                    nama: true,
                    role: true,
                    status: true
                }
            });

            res.status(200).json({
                success: true,
                message: 'Pengguna berhasil dinonaktifkan karena memiliki data terkait',
                data: deletedUser
            });
        } else {
            // Hard delete if no associated data
            await prisma.user.delete({
                where: { id }
            });

            res.status(200).json({
                success: true,
                message: 'Pengguna berhasil dihapus'
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat menghapus pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Change user password
export const changeUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body as ChangePasswordInput;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);

        if (!isCurrentPasswordValid) {
            res.status(400).json({
                success: false,
                message: 'Password lama tidak sesuai'
            });
            return;
        }

        // Hash new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword }
        });

        res.status(200).json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (error) {
        console.error('Error changing user password:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengubah password',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Toggle user status
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
            return;
        }

        // Prevent changing status of current user
        if (req.user?.userId === id) {
            res.status(400).json({
                success: false,
                message: 'Tidak dapat mengubah status akun sendiri'
            });
            return;
        }

        // Toggle status
        const newStatus = existingUser.status === 'AKTIF' ? 'TIDAK_AKTIF' : 'AKTIF';

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { status: newStatus },
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                status: true,
                updatedAt: true
            }
        });

        res.status(200).json({
            success: true,
            message: `Status pengguna berhasil diubah menjadi ${newStatus}`,
            data: updatedUser
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengubah status pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

// Get user statistics
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [totalUsers, activeUsers, inactiveUsers, adminUsers, opdUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: 'AKTIF' } }),
            prisma.user.count({ where: { status: 'TIDAK_AKTIF' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({ where: { role: 'OPD' } })
        ]);

        const stats = {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            admin: adminUsers,
            opd: opdUsers
        };

        res.status(200).json({
            success: true,
            message: 'Statistik pengguna berhasil diambil',
            data: stats
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil statistik pengguna',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};
