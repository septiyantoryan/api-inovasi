import { z } from 'zod'

// Schema for creating carousel image
export const createCarouselSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
    sortOrder: z.number().int().min(0, 'Sort order must be a positive integer').optional(),
    isActive: z.boolean().optional()
})

// Schema for updating carousel image
export const updateCarouselSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
    sortOrder: z.number().int().min(0, 'Sort order must be a positive integer').optional(),
    isActive: z.boolean().optional()
})

// Schema for updating sort order
export const updateSortOrderSchema = z.object({
    imageOrders: z.array(
        z.object({
            id: z.string().min(1, 'Image ID is required'),
            sortOrder: z.number().int().min(0, 'Sort order must be a positive integer')
        })
    ).min(1, 'At least one image order is required')
})

// Schema for carousel query parameters
export const carouselQuerySchema = z.object({
    isActive: z.enum(['true', 'false']).optional(),
    sortBy: z.enum(['sortOrder', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
})