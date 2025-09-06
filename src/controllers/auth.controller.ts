import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

interface AuthRequest extends Request {
    body: RegisterInput | LoginInput;
}

// Register new user
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, password, nama, role = 'OPD' } = req.body as RegisterInput;

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
                createdAt: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'User berhasil didaftarkan',
            data: newUser
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body as LoginInput;

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
            return;
        }

        // Check if user is active
        if (user.status === 'TIDAK_AKTIF') {
            res.status(403).json({
                success: false,
                message: 'Akun Anda tidak aktif'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user data without password
        const userData = {
            id: user.id,
            username: user.username,
            nama: user.nama,
            role: user.role,
            status: user.status
        };

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: userData,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Get current user profile
export const getProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Data profile berhasil diambil',
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Update user profile
export const updateProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { nama } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        if (!nama) {
            res.status(400).json({
                success: false,
                message: 'Nama harus diisi'
            });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { nama },
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                status: true,
                updatedAt: true
            }
        });

        res.json({
            success: true,
            message: 'Profile berhasil diupdate',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};
