import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const systemTitleController = {
    // Get all system titles
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

            const where: any = {}
            if (isActive !== undefined) {
                where.isActive = isActive === 'true'
            }

            const orderBy: any = {}
            orderBy[sortBy as string] = sortOrder

            const systemTitles = await prisma.systemTitle.findMany({
                where,
                orderBy
            })

            res.json({
                success: true,
                message: 'System titles retrieved successfully',
                data: systemTitles
            })
        } catch (error) {
            console.error('Error getting system titles:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Get active system titles only
    async getActive(req: Request, res: Response): Promise<void> {
        try {
            const systemTitles = await prisma.systemTitle.findMany({
                where: {
                    isActive: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            res.json({
                success: true,
                message: 'Active system titles retrieved successfully',
                data: systemTitles
            })
        } catch (error) {
            console.error('Error getting active system titles:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Get system title by ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            const systemTitle = await prisma.systemTitle.findUnique({
                where: { id }
            })

            if (!systemTitle) {
                res.status(404).json({
                    success: false,
                    message: 'System title not found'
                })
                return
            }

            res.json({
                success: true,
                message: 'System title retrieved successfully',
                data: systemTitle
            })
        } catch (error) {
            console.error('Error getting system title:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Create new system title
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { title, isActive = true } = req.body

            const systemTitle = await prisma.systemTitle.create({
                data: {
                    title,
                    isActive
                }
            })

            res.status(201).json({
                success: true,
                message: 'System title created successfully',
                data: systemTitle
            })
        } catch (error) {
            console.error('Error creating system title:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Update system title
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const { title, isActive } = req.body

            // Check if system title exists
            const existingSystemTitle = await prisma.systemTitle.findUnique({
                where: { id }
            })

            if (!existingSystemTitle) {
                res.status(404).json({
                    success: false,
                    message: 'System title not found'
                })
                return
            }

            const updateData: any = {}
            if (title !== undefined) updateData.title = title
            if (isActive !== undefined) updateData.isActive = isActive

            const systemTitle = await prisma.systemTitle.update({
                where: { id },
                data: updateData
            })

            res.json({
                success: true,
                message: 'System title updated successfully',
                data: systemTitle
            })
        } catch (error) {
            console.error('Error updating system title:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Delete system title
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            // Check if system title exists
            const existingSystemTitle = await prisma.systemTitle.findUnique({
                where: { id }
            })

            if (!existingSystemTitle) {
                res.status(404).json({
                    success: false,
                    message: 'System title not found'
                })
                return
            }

            await prisma.systemTitle.delete({
                where: { id }
            })

            res.json({
                success: true,
                message: 'System title deleted successfully'
            })
        } catch (error) {
            console.error('Error deleting system title:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Toggle active status
    async toggleActive(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params

            // Check if system title exists
            const existingSystemTitle = await prisma.systemTitle.findUnique({
                where: { id }
            })

            if (!existingSystemTitle) {
                res.status(404).json({
                    success: false,
                    message: 'System title not found'
                })
                return
            }

            const systemTitle = await prisma.systemTitle.update({
                where: { id },
                data: {
                    isActive: !existingSystemTitle.isActive
                }
            })

            res.json({
                success: true,
                message: `System title ${systemTitle.isActive ? 'activated' : 'deactivated'} successfully`,
                data: systemTitle
            })
        } catch (error) {
            console.error('Error toggling system title status:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}
