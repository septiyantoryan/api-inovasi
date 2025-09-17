import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { Request } from 'express'

// Define allowed image types for carousel
const ALLOWED_IMAGE_TYPES = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
}

// Custom storage configuration for carousel images
const carouselStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        try {
            // Create upload directory: src/uploads/carousel/
            const uploadDir = path.join(process.cwd(), 'src', 'uploads', 'carousel')

            // Create directories if they don't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            cb(null, uploadDir)
        } catch (error) {
            cb(error as Error, '')
        }
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        try {
            // Generate random filename with timestamp
            const randomName = uuidv4()
            const timestamp = Date.now()
            const fileExtension = path.extname(file.originalname).toLowerCase()
            const fileName = `carousel_${timestamp}_${randomName}${fileExtension}`

            cb(null, fileName)
        } catch (error) {
            cb(error as Error, '')
        }
    }
})

// File filter function for images only
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check if file type is allowed
    if (ALLOWED_IMAGE_TYPES[file.mimetype as keyof typeof ALLOWED_IMAGE_TYPES]) {
        cb(null, true)
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: JPG, JPEG, PNG, WEBP`))
    }
}

// Configure multer for carousel images
export const carouselUpload = multer({
    storage: carouselStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 1 // Only one file at a time
    }
})

// Helper function to clean up carousel uploaded file in case of error
export const cleanupCarouselFile = (filePath: string) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    } catch (error) {
        console.error('Error cleaning up carousel file:', error)
    }
}