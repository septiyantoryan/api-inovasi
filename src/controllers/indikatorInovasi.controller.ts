import { Request, Response } from 'express';
import prisma from '../lib/prisma';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

// Create new Indikator Inovasi
export const createIndikatorInovasi = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            profilInovasiId,
            regulasiInovasiDaerah,
            ketersediaanSDM,
            dukunganAnggaran,
            alatKerja,
            bimtekInovasi,
            integrasiProgramRKPD,
            keterlibatanAktorInovasi,
            pelaksanaInovasiDaerah,
            jejaringInovasi,
            sosialisasiInovasiDaerah,
            pedomanTeknis,
            kemudahanInformasiLayanan,
            kemudahanProsesInovasi,
            penyelesaianLayananPengaduan,
            layananTerintegrasi,
            replikasi,
            kecepatanPenciptaanInovasi,
            kemanfaatanInovasi,
            monitoringEvaluasiInovasiDaerah,
            kualitasInovasiDaerah
        } = req.body;

        // Validate that all required fields are provided
        const requiredFields = [
            'profilInovasiId', 'regulasiInovasiDaerah', 'ketersediaanSDM', 'dukunganAnggaran',
            'alatKerja', 'bimtekInovasi', 'integrasiProgramRKPD', 'keterlibatanAktorInovasi',
            'pelaksanaInovasiDaerah', 'jejaringInovasi', 'sosialisasiInovasiDaerah', 'pedomanTeknis',
            'kemudahanInformasiLayanan', 'kemudahanProsesInovasi', 'penyelesaianLayananPengaduan',
            'layananTerintegrasi', 'replikasi', 'kecepatanPenciptaanInovasi', 'kemanfaatanInovasi',
            'monitoringEvaluasiInovasiDaerah', 'kualitasInovasiDaerah'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            res.status(400).json({
                error: 'Bad Request',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
            return;
        }

        // Check if ProfilInovasi exists
        const profilInovasi = await prisma.profilInovasi.findUnique({
            where: { id: profilInovasiId }
        });

        if (!profilInovasi) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Profil Inovasi not found'
            });
            return;
        }

        // Check if IndikatorInovasi already exists for this ProfilInovasi
        const existingIndikator = await prisma.indikatorInovasi.findUnique({
            where: { profilInovasiId }
        });

        if (existingIndikator) {
            res.status(409).json({
                error: 'Conflict',
                message: 'Indikator Inovasi already exists for this Profil Inovasi'
            });
            return;
        }

        // Create IndikatorInovasi
        const indikatorInovasi = await prisma.indikatorInovasi.create({
            data: {
                profilInovasiId,
                regulasiInovasiDaerah,
                ketersediaanSDM,
                dukunganAnggaran,
                alatKerja,
                bimtekInovasi,
                integrasiProgramRKPD,
                keterlibatanAktorInovasi,
                pelaksanaInovasiDaerah,
                jejaringInovasi,
                sosialisasiInovasiDaerah,
                pedomanTeknis,
                kemudahanInformasiLayanan,
                kemudahanProsesInovasi,
                penyelesaianLayananPengaduan,
                layananTerintegrasi,
                replikasi,
                kecepatanPenciptaanInovasi,
                kemanfaatanInovasi,
                monitoringEvaluasiInovasiDaerah,
                kualitasInovasiDaerah
            },
            include: {
                profilInovasi: true
            }
        });

        res.status(201).json({
            message: 'Indikator Inovasi created successfully',
            data: indikatorInovasi
        });
    } catch (error) {
        console.error('Error creating Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create Indikator Inovasi'
        });
    }
};

// Get all Indikator Inovasi
export const getAllIndikatorInovasi = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const indikatorInovasi = await prisma.indikatorInovasi.findMany({
            include: {
                profilInovasi: {
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            message: 'Indikator Inovasi retrieved successfully',
            data: indikatorInovasi
        });
    } catch (error) {
        console.error('Error retrieving Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve Indikator Inovasi'
        });
    }
};

// Get Indikator Inovasi by ID
export const getIndikatorInovasiById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const indikatorInovasi = await prisma.indikatorInovasi.findUnique({
            where: { id },
            include: {
                profilInovasi: {
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
                }
            }
        });

        if (!indikatorInovasi) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Indikator Inovasi not found'
            });
            return;
        }

        res.status(200).json({
            message: 'Indikator Inovasi retrieved successfully',
            data: indikatorInovasi
        });
    } catch (error) {
        console.error('Error retrieving Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve Indikator Inovasi'
        });
    }
};

// Get Indikator Inovasi by Profil Inovasi ID
export const getIndikatorInovasiByProfilId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { profilInovasiId } = req.params;

        const indikatorInovasi = await prisma.indikatorInovasi.findUnique({
            where: { profilInovasiId },
            include: {
                profilInovasi: {
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
                }
            }
        });

        if (!indikatorInovasi) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Indikator Inovasi not found for this Profil Inovasi'
            });
            return;
        }

        res.status(200).json({
            message: 'Indikator Inovasi retrieved successfully',
            data: indikatorInovasi
        });
    } catch (error) {
        console.error('Error retrieving Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve Indikator Inovasi'
        });
    }
};

// Update Indikator Inovasi
export const updateIndikatorInovasi = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove profilInovasiId from update data if present (shouldn't be updated)
        delete updateData.profilInovasiId;

        const indikatorInovasi = await prisma.indikatorInovasi.findUnique({
            where: { id }
        });

        if (!indikatorInovasi) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Indikator Inovasi not found'
            });
            return;
        }

        const updatedIndikatorInovasi = await prisma.indikatorInovasi.update({
            where: { id },
            data: updateData,
            include: {
                profilInovasi: true
            }
        });

        res.status(200).json({
            message: 'Indikator Inovasi updated successfully',
            data: updatedIndikatorInovasi
        });
    } catch (error) {
        console.error('Error updating Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update Indikator Inovasi'
        });
    }
};

// Delete Indikator Inovasi
export const deleteIndikatorInovasi = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const indikatorInovasi = await prisma.indikatorInovasi.findUnique({
            where: { id }
        });

        if (!indikatorInovasi) {
            res.status(404).json({
                error: 'Not Found',
                message: 'Indikator Inovasi not found'
            });
            return;
        }

        await prisma.indikatorInovasi.delete({
            where: { id }
        });

        res.status(200).json({
            message: 'Indikator Inovasi deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Indikator Inovasi:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete Indikator Inovasi'
        });
    }
};
