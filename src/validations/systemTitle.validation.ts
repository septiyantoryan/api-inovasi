import { z } from 'zod'

// Schema for creating system title
export const createSystemTitleSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(1000, 'Title must be less than 1000 characters'),
        isActive: z.boolean().optional().default(true)
    })
})

// Schema for updating system title
export const updateSystemTitleSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(1000, 'Title must be less than 1000 characters').optional(),
        isActive: z.boolean().optional()
    })
})

// Schema for system title query parameters
export const systemTitleQuerySchema = z.object({
    isActive: z.enum(['true', 'false']).optional(),
    sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
})
