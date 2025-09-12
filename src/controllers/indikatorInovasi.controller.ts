import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
    CreateIndikatorInovasiInput,
    UpdateIndikatorInovasiInput,
    IndikatorInovasiParams,
    IndikatorInovasiProfilParams,
    IndikatorInovasiQuery
} from '../validations/indikatorInovasi.validation';
import { canUserCreateIndikator } from '../utils/inovasi-status';
import { getRelativeFilePath, cleanupUploadedFiles } from '../middleware/upload';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

interface CreateIndikatorRequest extends AuthRequest {
    body: CreateIndikatorInovasiInput;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

interface UpdateIndikatorRequest extends AuthRequest {
    body: UpdateIndikatorInovasiInput;
    params: IndikatorInovasiParams;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

interface GetIndikatorRequest extends AuthRequest {
    params: IndikatorInovasiParams;
}

interface GetIndikatorByProfilRequest extends AuthRequest {
    params: IndikatorInovasiProfilParams;
}

// Create new Indikator Inovasi with file uploads
export const createIndikatorInovasi = async (req: CreateIndikatorRequest, res: Response): Promise<void> => {
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

        const { profilInovasiId, kualitasInovasiDaerah } = req.body;
        const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Check if ProfilInovasi exists and get with indikator info
        const profilInovasi = await prisma.profilInovasi.findUnique({
            where: { id: profilInovasiId },
            include: {
                indikatorInovasi: {
                    select: { id: true }
                }
            }
        });

        // Validate if user can create indikator using helper function
        const validation = canUserCreateIndikator(profilInovasi, userId, userRole!);

        if (!validation.canCreate) {
            // Clean up uploaded files if validation fails
            cleanupUploadedFiles(uploadedFiles);

            const statusCode = validation.reason?.includes('tidak ditemukan') ? 404 :
                validation.reason?.includes('tidak memiliki akses') ? 403 : 409;

            res.status(statusCode).json({
                success: false,
                message: validation.reason
            });
            return;
        }

        // Build file paths object from uploaded files
        const filePaths: { [key: string]: string } = {};

        if (uploadedFiles) {
            Object.keys(uploadedFiles).forEach(fieldName => {
                const files = uploadedFiles[fieldName];
                if (files && files.length > 0 && files[0]) {
                    // Store relative path to uploads directory
                    filePaths[fieldName] = getRelativeFilePath(files[0].path);
                }
            });
        }

        // Validate that all required files are uploaded (except kualitasInovasiDaerah which is URL)
        const requiredFields = [
            'regulasiInovasiDaerah', 'ketersediaanSDM', 'dukunganAnggaran', 'alatKerja',
            'bimtekInovasi', 'integrasiProgramRKPD', 'keterlibatanAktorInovasi',
            'pelaksanaInovasiDaerah', 'jejaringInovasi', 'sosialisasiInovasiDaerah',
            'pedomanTeknis', 'kemudahanInformasiLayanan', 'kemudahanProsesInovasi',
            'penyelesaianLayananPengaduan', 'layananTerintegrasi', 'replikasi',
            'kecepatanPenciptaanInovasi', 'kemanfaatanInovasi', 'monitoringEvaluasiInovasiDaerah'
        ];

        const missingFiles = requiredFields.filter(field => !filePaths[field]);

        if (missingFiles.length > 0) {
            // Clean up uploaded files
            cleanupUploadedFiles(uploadedFiles);

            res.status(400).json({
                success: false,
                message: `File berikut harus diupload: ${missingFiles.join(', ')}`
            });
            return;
        }

        // Validate YouTube URL
        if (!kualitasInovasiDaerah || !isValidYouTubeUrl(kualitasInovasiDaerah)) {
            // Clean up uploaded files
            cleanupUploadedFiles(uploadedFiles);

            res.status(400).json({
                success: false,
                message: 'URL YouTube untuk kualitas inovasi daerah tidak valid'
            });
            return;
        }

        // Create IndikatorInovasi with file paths
        const indikatorInovasi = await prisma.indikatorInovasi.create({
            data: {
                profilInovasiId,
                regulasiInovasiDaerah: filePaths.regulasiInovasiDaerah!,
                ketersediaanSDM: filePaths.ketersediaanSDM!,
                dukunganAnggaran: filePaths.dukunganAnggaran!,
                alatKerja: filePaths.alatKerja!,
                bimtekInovasi: filePaths.bimtekInovasi!,
                integrasiProgramRKPD: filePaths.integrasiProgramRKPD!,
                keterlibatanAktorInovasi: filePaths.keterlibatanAktorInovasi!,
                pelaksanaInovasiDaerah: filePaths.pelaksanaInovasiDaerah!,
                jejaringInovasi: filePaths.jejaringInovasi!,
                sosialisasiInovasiDaerah: filePaths.sosialisasiInovasiDaerah!,
                pedomanTeknis: filePaths.pedomanTeknis!,
                kemudahanInformasiLayanan: filePaths.kemudahanInformasiLayanan!,
                kemudahanProsesInovasi: filePaths.kemudahanProsesInovasi!,
                penyelesaianLayananPengaduan: filePaths.penyelesaianLayananPengaduan!,
                layananTerintegrasi: filePaths.layananTerintegrasi!,
                replikasi: filePaths.replikasi!,
                kecepatanPenciptaanInovasi: filePaths.kecepatanPenciptaanInovasi!,
                kemanfaatanInovasi: filePaths.kemanfaatanInovasi!,
                monitoringEvaluasiInovasiDaerah: filePaths.monitoringEvaluasiInovasiDaerah!,
                kualitasInovasiDaerah
            },
            include: {
                profilInovasi: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Indikator Inovasi berhasil dibuat dengan file upload',
            data: indikatorInovasi
        });
    } catch (error) {
        console.error('Error creating Indikator Inovasi:', error);

        // Clean up uploaded files in case of error
        cleanupUploadedFiles(req.files as { [fieldname: string]: Express.Multer.File[] });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat membuat indikator inovasi'
        });
    }
};

// Helper function to validate YouTube URL
const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    return youtubeRegex.test(url);
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
export const getIndikatorInovasiById = async (req: GetIndikatorRequest, res: Response): Promise<void> => {
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
export const getIndikatorInovasiByProfilId = async (req: GetIndikatorByProfilRequest, res: Response): Promise<void> => {
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
export const updateIndikatorInovasi = async (req: UpdateIndikatorRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { id } = req.params;
        const { kualitasInovasiDaerah } = req.body;
        const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
            return;
        }

        // Check if IndikatorInovasi exists
        const existingIndikator = await prisma.indikatorInovasi.findUnique({
            where: { id },
            include: {
                profilInovasi: {
                    select: {
                        id: true,
                        userId: true
                    }
                }
            }
        });

        if (!existingIndikator) {
            // Clean up uploaded files if indikator not found
            cleanupUploadedFiles(uploadedFiles);

            res.status(404).json({
                success: false,
                message: 'Indikator Inovasi tidak ditemukan'
            });
            return;
        }

        // Check if user has permission to update
        const canUpdate = userRole === 'ADMIN' || existingIndikator.profilInovasi.userId === userId;

        if (!canUpdate) {
            // Clean up uploaded files if user doesn't have permission
            cleanupUploadedFiles(uploadedFiles);

            res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk mengedit indikator inovasi ini'
            });
            return;
        }

        // Build update data object
        const updateData: any = {};

        // Handle file uploads
        if (uploadedFiles) {
            Object.keys(uploadedFiles).forEach(fieldName => {
                const files = uploadedFiles[fieldName];
                if (files && files.length > 0 && files[0]) {
                    // Store relative path to uploads directory
                    updateData[fieldName] = getRelativeFilePath(files[0].path);
                }
            });
        }

        // Handle YouTube URL update
        if (kualitasInovasiDaerah !== undefined) {
            if (kualitasInovasiDaerah && !isValidYouTubeUrl(kualitasInovasiDaerah)) {
                // Clean up uploaded files
                cleanupUploadedFiles(uploadedFiles);

                res.status(400).json({
                    success: false,
                    message: 'URL YouTube untuk kualitas inovasi daerah tidak valid'
                });
                return;
            }
            updateData.kualitasInovasiDaerah = kualitasInovasiDaerah;
        }

        // Only update if there's data to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: 'Tidak ada data untuk diupdate'
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
            success: true,
            message: 'Indikator Inovasi berhasil diperbarui',
            data: updatedIndikatorInovasi
        });
    } catch (error) {
        console.error('Error updating Indikator Inovasi:', error);

        // Clean up uploaded files in case of error
        cleanupUploadedFiles(req.files as { [fieldname: string]: Express.Multer.File[] });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat memperbarui indikator inovasi'
        });
    }
};

// Delete Indikator Inovasi
export const deleteIndikatorInovasi = async (req: GetIndikatorRequest, res: Response): Promise<void> => {
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
