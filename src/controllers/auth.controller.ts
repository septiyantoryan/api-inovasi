import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, nama, role } = req.body;

        // Validate required fields
        if (!username || !password || !nama) {
            res.status(400).json({
                success: false,
                message: 'Username, password, dan nama harus diisi'
            });
            return;
        }

        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Username sudah digunakan'
            });
            return;
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                nama,
                role: role || 'OPD'
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
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Username dan password harus diisi'
            });
            return;
        }

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
        if (user.status !== 'AKTIF') {
            res.status(401).json({
                success: false,
                message: 'Akun tidak aktif'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            username: user.username,
            role: user.role
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    nama: user.nama,
                    role: user.role,
                    status: user.status
                },
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
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
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

        res.status(200).json({
            success: true,
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
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.userId;
        const { nama, password } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const updateData: any = {};

        if (nama) {
            updateData.nama = nama;
        }

        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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

// Logout (for token blacklisting if needed)
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // In a real app, you might want to blacklist the token
        res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};