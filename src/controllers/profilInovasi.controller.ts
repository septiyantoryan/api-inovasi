import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
    CreateProfilInovasiInput,
    UpdateProfilInovasiInput,
    ProfilInovasiParams
} from '../validations/profilInovasi.validation';
import { formatInovasiResponse } from '../utils/inovasi-status';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

interface ProfilInovasiRequest extends AuthenticatedRequest {
    body: CreateProfilInovasiInput | UpdateProfilInovasiInput;
    params: ProfilInovasiParams;
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

        // Verify that the user exists in the database
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
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
            tujuanInovasi,
            manfaatInovasi,
            hasilInovasi
        } = req.body as CreateProfilInovasiInput;

        // Parse dates
        const parsedTanggalUjiCoba = new Date(tanggalUjiCoba);
        const parsedTanggalPenerapan = new Date(tanggalPenerapan);

        const newProfilInovasi = await prisma.profilInovasi.create({
            data: {
                namaInovasi,
                inovator,
                jenisInovasi,
                bentukInovasi,
                tanggalUjiCoba: parsedTanggalUjiCoba,
                tanggalPenerapan: parsedTanggalPenerapan,
                rancangBangun,
                tujuanInovasi,
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

        // Handle specific Prisma errors
        if (error instanceof Error) {
            if (error.message.includes('P2003')) {
                res.status(400).json({
                    success: false,
                    message: 'User tidak valid atau tidak ditemukan'
                });
                return;
            }

            if (error.message.includes('P2002')) {
                res.status(400).json({
                    success: false,
                    message: 'Data duplikat ditemukan'
                });
                return;
            }
        }

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
                    },
                    indikatorInovasi: {
                        select: {
                            id: true,
                            createdAt: true
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

        // Format response with status information
        const formattedProfilInovasi = formatInovasiResponse(profilInovasi);

        res.json({
            success: true,
            message: 'Data profil inovasi berhasil diambil',
            data: {
                profilInovasi: formattedProfilInovasi,
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

// Get all profil inovasi for public view (no authentication required)
export const getPublicProfilInovasi = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        let whereClause: any = {};

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
                    },
                    indikatorInovasi: {
                        select: {
                            id: true,
                            createdAt: true
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

        // Format response with status information
        const formattedProfilInovasi = formatInovasiResponse(profilInovasi);

        res.json({
            success: true,
            message: 'Data profil inovasi berhasil diambil',
            data: {
                profilInovasi: formattedProfilInovasi,
                pagination: {
                    total,
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    totalPages: Math.ceil(total / parseInt(limit as string))
                }
            }
        });

    } catch (error) {
        console.error('Get public profil inovasi error:', error);
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
                },
                indikatorInovasi: {
                    select: {
                        id: true,
                        createdAt: true
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

        // Format response with status information
        const formattedProfilInovasi = formatInovasiResponse(profilInovasi);

        res.json({
            success: true,
            message: 'Data profil inovasi berhasil diambil',
            data: formattedProfilInovasi
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
            tujuanInovasi,
            manfaatInovasi,
            hasilInovasi
        } = req.body as UpdateProfilInovasiInput;

        // Parse dates if provided
        let parsedTanggalUjiCoba;
        let parsedTanggalPenerapan;

        if (tanggalUjiCoba) {
            parsedTanggalUjiCoba = new Date(tanggalUjiCoba);
        }

        if (tanggalPenerapan) {
            parsedTanggalPenerapan = new Date(tanggalPenerapan);
        }

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
                ...(tujuanInovasi && { tujuanInovasi }),
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
