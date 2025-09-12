import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request, RequestHandler } from 'express';

// Define file types for indikator inovasi
const ALLOWED_FILE_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/pdf': '.pdf'
};

// Custom storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        try {
            // Get profil inovasi ID from request body
            const profilInovasiId = req.body.profilInovasiId;

            if (!profilInovasiId) {
                return cb(new Error('Profil Inovasi ID is required'), '');
            }

            // Create upload directory structure: src/uploads/{uuid_profil_inovasi}/
            const uploadDir = path.join(process.cwd(), 'src', 'uploads', profilInovasiId);

            // Create directories if they don't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            cb(null, uploadDir);
        } catch (error) {
            cb(error as Error, '');
        }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        try {
            // Generate random filename
            const randomName = uuidv4();
            const fileExtension = path.extname(file.originalname);
            const fileName = `${randomName}${fileExtension}`;

            cb(null, fileName);
        } catch (error) {
            cb(error as Error, '');
        }
    }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check if file type is allowed
    if (ALLOWED_FILE_TYPES[file.mimetype as keyof typeof ALLOWED_FILE_TYPES]) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: PDF, JPG, PNG`));
    }
};

// Configure multer
export const uploadIndikatorFiles = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 20 // Maximum 20 files (all indikator fields)
    }
});

// Middleware to handle multiple files for indikator inovasi
export const uploadIndikatorMiddleware: RequestHandler = uploadIndikatorFiles.fields([
    { name: 'regulasiInovasiDaerah', maxCount: 1 },
    { name: 'ketersediaanSDM', maxCount: 1 },
    { name: 'dukunganAnggaran', maxCount: 1 },
    { name: 'alatKerja', maxCount: 1 },
    { name: 'bimtekInovasi', maxCount: 1 },
    { name: 'integrasiProgramRKPD', maxCount: 1 },
    { name: 'keterlibatanAktorInovasi', maxCount: 1 },
    { name: 'pelaksanaInovasiDaerah', maxCount: 1 },
    { name: 'jejaringInovasi', maxCount: 1 },
    { name: 'sosialisasiInovasiDaerah', maxCount: 1 },
    { name: 'pedomanTeknis', maxCount: 1 },
    { name: 'kemudahanInformasiLayanan', maxCount: 1 },
    { name: 'kemudahanProsesInovasi', maxCount: 1 },
    { name: 'penyelesaianLayananPengaduan', maxCount: 1 },
    { name: 'layananTerintegrasi', maxCount: 1 },
    { name: 'replikasi', maxCount: 1 },
    { name: 'kecepatanPenciptaanInovasi', maxCount: 1 },
    { name: 'kemanfaatanInovasi', maxCount: 1 },
    { name: 'monitoringEvaluasiInovasiDaerah', maxCount: 1 }
]);

// Helper function to get file path relative to uploads directory
export const getRelativeFilePath = (filePath: string): string => {
    const uploadsIndex = filePath.indexOf('uploads');
    if (uploadsIndex !== -1) {
        // Return path after 'uploads/' to avoid duplication
        const relativePath = filePath.substring(uploadsIndex + 8); // +8 to skip 'uploads/'
        return relativePath;
    }
    return filePath;
};

// Helper function to clean up uploaded files in case of error
export const cleanupUploadedFiles = (files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined) => {
    if (!files) return;

    try {
        if (Array.isArray(files)) {
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        } else {
            Object.values(files).forEach(fileArray => {
                fileArray.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error cleaning up uploaded files:', error);
    }
};
