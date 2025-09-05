import { Request, Response } from 'express';
import prisma from '../lib/prisma';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

interface ProfilInovasiRequest extends AuthenticatedRequest {
    body: {
        namaInovasi: string;
        inovator: string;
        jenisInovasi: 'DIGITAL' | 'NON_DIGITAL';
        bentukInovasi: string;
        tanggalUjiCoba?: string;
        tanggalPenerapan?: string;
        rancangBangun: string;
        manfaatInovasi: string;
        hasilInovasi: string;
    };
}

// Create new profil inovasi
export const createProfilInovasi = async (req: ProfilInovasiRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        const {
            namaInovasi,
            inovator,
            jenisInovasi,
            bentukInovasi,
            tanggalUjiCoba,
            tanggalPenerapan,
            rancangBangun,
            manfaatInovasi,
            hasilInovasi
        } = req.body;

        // Validate required fields
        if (!namaInovasi || !inovator || !jenisInovasi || !bentukInovasi || !rancangBangun || !manfaatInovasi || !hasilInovasi) {
            res.status(400).json({
                success: false,
                message: 'Semua field wajib harus diisi'
            });
            return;
        }

        // Validate rancangBangun minimum 300 characters
        if (rancangBangun.length < 300) {
            res.status(400).json({
                success: false,
                message: 'Rancang bangun minimal 300 karakter'
            });
            return;
        }

        // Parse dates if provided
        const parsedTanggalUjiCoba = tanggalUjiCoba ? new Date(tanggalUjiCoba) : undefined;
        const parsedTanggalPenerapan = tanggalPenerapan ? new Date(tanggalPenerapan) : undefined;

        const newProfilInovasi = await prisma.profilInovasi.create({
            data: {
                namaInovasi,
                inovator,
                jenisInovasi,
                bentukInovasi,
                tanggalUjiCoba: parsedTanggalUjiCoba,
                tanggalPenerapan: parsedTanggalPenerapan,
                rancangBangun,
                manfaatInovasi,
                hasilInovasi,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        nama: true,
                        role: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Profil inovasi berhasil dibuat',
            data: newProfilInovasi
        });

    } catch (error) {
        console.error('Create profil inovasi error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Get all profil inovasi (for admin) or user's own profil inovasi
export const getAllProfilInovasi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        const { page = '1', limit = '10', search = '' } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        let whereClause: any = {};

        // If not admin, only show user's own data
        if (userRole !== 'ADMIN') {
            whereClause.userId = userId;
        }

        // Add search functionality
        if (search) {
            whereClause.OR = [
                { namaInovasi: { contains: search as string } },
                { inovator: { contains: search as string } },
                { bentukInovasi: { contains: search as string } }
            ];
        }

        const [profilInovasi, total] = await Promise.all([
            prisma.profilInovasi.findMany({
                where: whereClause,
                skip,
                take: parseInt(limit as string),
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            nama: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.profilInovasi.count({
                where: whereClause
            })
        ]);

        res.json({
            success: true,
            message: 'Data profil inovasi berhasil diambil',
            data: {
                profilInovasi,
                pagination: {
                    total,
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    totalPages: Math.ceil(total / parseInt(limit as string))
                }
            }
        });

    } catch (error) {
        console.error('Get all profil inovasi error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Get profil inovasi by ID
export const getProfilInovasiById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        const profilInovasi = await prisma.profilInovasi.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        nama: true,
                        role: true
                    }
                }
            }
        });

        if (!profilInovasi) {
            res.status(404).json({
                success: false,
                message: 'Profil inovasi tidak ditemukan'
            });
            return;
        }

        // Check if user can access this data
        if (userRole !== 'ADMIN' && profilInovasi.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses ke data ini'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Data profil inovasi berhasil diambil',
            data: profilInovasi
        });

    } catch (error) {
        console.error('Get profil inovasi by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Update profil inovasi
export const updateProfilInovasi = async (req: ProfilInovasiRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        // Check if profil inovasi exists
        const existingProfilInovasi = await prisma.profilInovasi.findUnique({
            where: { id }
        });

        if (!existingProfilInovasi) {
            res.status(404).json({
                success: false,
                message: 'Profil inovasi tidak ditemukan'
            });
            return;
        }

        // Check if user can update this data
        if (userRole !== 'ADMIN' && existingProfilInovasi.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk mengupdate data ini'
            });
            return;
        }

        const {
            namaInovasi,
            inovator,
            jenisInovasi,
            bentukInovasi,
            tanggalUjiCoba,
            tanggalPenerapan,
            rancangBangun,
            manfaatInovasi,
            hasilInovasi
        } = req.body;

        // Validate rancangBangun minimum 300 characters if provided
        if (rancangBangun && rancangBangun.length < 300) {
            res.status(400).json({
                success: false,
                message: 'Rancang bangun minimal 300 karakter'
            });
            return;
        }

        // Parse dates if provided
        const parsedTanggalUjiCoba = tanggalUjiCoba ? new Date(tanggalUjiCoba) : undefined;
        const parsedTanggalPenerapan = tanggalPenerapan ? new Date(tanggalPenerapan) : undefined;

        const updatedProfilInovasi = await prisma.profilInovasi.update({
            where: { id },
            data: {
                ...(namaInovasi && { namaInovasi }),
                ...(inovator && { inovator }),
                ...(jenisInovasi && { jenisInovasi }),
                ...(bentukInovasi && { bentukInovasi }),
                ...(tanggalUjiCoba !== undefined && { tanggalUjiCoba: parsedTanggalUjiCoba }),
                ...(tanggalPenerapan !== undefined && { tanggalPenerapan: parsedTanggalPenerapan }),
                ...(rancangBangun && { rancangBangun }),
                ...(manfaatInovasi && { manfaatInovasi }),
                ...(hasilInovasi && { hasilInovasi })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        nama: true,
                        role: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Profil inovasi berhasil diupdate',
            data: updatedProfilInovasi
        });

    } catch (error) {
        console.error('Update profil inovasi error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};

// Delete profil inovasi
export const deleteProfilInovasi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        // Check if profil inovasi exists
        const existingProfilInovasi = await prisma.profilInovasi.findUnique({
            where: { id }
        });

        if (!existingProfilInovasi) {
            res.status(404).json({
                success: false,
                message: 'Profil inovasi tidak ditemukan'
            });
            return;
        }

        // Check if user can delete this data
        if (userRole !== 'ADMIN' && existingProfilInovasi.userId !== userId) {
            res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk menghapus data ini'
            });
            return;
        }

        await prisma.profilInovasi.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Profil inovasi berhasil dihapus'
        });

    } catch (error) {
        console.error('Delete profil inovasi error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
};
