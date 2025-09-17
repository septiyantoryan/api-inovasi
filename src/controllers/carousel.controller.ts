import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export const carouselController = {
    // Get all carousel images
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const carouselImages = await prisma.carouselImage.findMany({
                orderBy: {
                    sortOrder: 'asc'
                }
            })

            res.json({
                success: true,
                message: 'Carousel images retrieved successfully',
                data: carouselImages
            })
        } catch (error) {
            console.error('Error getting carousel images:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Get active carousel images only
    async getActive(req: Request, res: Response): Promise<void> {
        try {
            const carouselImages = await prisma.carouselImage.findMany({
                where: {
                    isActive: true
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            })

            res.json({
                success: true,
                message: 'Active carousel images retrieved successfully',
                data: carouselImages
            })
        } catch (error) {
            console.error('Error getting active carousel images:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Get carousel image by ID
    async getById(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params

            const carouselImage = await prisma.carouselImage.findUnique({
                where: { id }
            })

            if (!carouselImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Carousel image not found'
                })
            }

            res.json({
                success: true,
                message: 'Carousel image retrieved successfully',
                data: carouselImage
            })
        } catch (error) {
            console.error('Error getting carousel image:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Create new carousel image
    async create(req: Request, res: Response): Promise<Response | void> {
        try {
            const { title, sortOrder, isActive } = req.body

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image file is required'
                })
            }

            // Create carousel image record
            const carouselImage = await prisma.carouselImage.create({
                data: {
                    title: title || null,
                    path: req.file.filename, // Store only filename, path construction handled by frontend
                    sortOrder: sortOrder ? parseInt(sortOrder) : 0,
                    isActive: isActive !== undefined ? isActive === 'true' : true
                }
            })

            res.status(201).json({
                success: true,
                message: 'Carousel image created successfully',
                data: carouselImage
            })
        } catch (error) {
            console.error('Error creating carousel image:', error)

            // Delete uploaded file if database operation fails
            if (req.file) {
                const filePath = path.join(process.cwd(), 'src', 'uploads', 'carousel', req.file.filename)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Update carousel image
    async update(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params
            const { title, sortOrder, isActive } = req.body

            // Check if carousel image exists
            const existingImage = await prisma.carouselImage.findUnique({
                where: { id }
            })

            if (!existingImage) {
                // Delete uploaded file if any
                if (req.file) {
                    const filePath = path.join(process.cwd(), 'src', 'uploads', 'carousel', req.file.filename)
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                    }
                }

                return res.status(404).json({
                    success: false,
                    message: 'Carousel image not found'
                })
            }

            // Prepare update data
            const updateData: any = {}

            if (title !== undefined) updateData.title = title || null
            if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder)
            if (isActive !== undefined) updateData.isActive = isActive === 'true'

            // If new file is uploaded, update path and delete old file
            if (req.file) {
                // Delete old file
                const oldFilePath = path.join(process.cwd(), 'src', 'uploads', 'carousel', existingImage.path)
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath)
                }

                updateData.path = req.file.filename // Store only filename
            }

            // Update carousel image
            const updatedImage = await prisma.carouselImage.update({
                where: { id },
                data: updateData
            })

            res.json({
                success: true,
                message: 'Carousel image updated successfully',
                data: updatedImage
            })
        } catch (error) {
            console.error('Error updating carousel image:', error)

            // Delete uploaded file if database operation fails
            if (req.file) {
                const filePath = path.join(process.cwd(), 'src', 'uploads', 'carousel', req.file.filename)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Delete carousel image
    async delete(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params

            // Check if carousel image exists
            const existingImage = await prisma.carouselImage.findUnique({
                where: { id }
            })

            if (!existingImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Carousel image not found'
                })
            }

            // Delete file from filesystem
            const filePath = path.join(process.cwd(), 'src', 'uploads', 'carousel', existingImage.path)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }

            // Delete from database
            await prisma.carouselImage.delete({
                where: { id }
            })

            res.json({
                success: true,
                message: 'Carousel image deleted successfully'
            })
        } catch (error) {
            console.error('Error deleting carousel image:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Update sort order of multiple images
    async updateSortOrder(req: Request, res: Response): Promise<Response | void> {
        try {
            const { imageOrders } = req.body

            if (!Array.isArray(imageOrders)) {
                return res.status(400).json({
                    success: false,
                    message: 'imageOrders must be an array'
                })
            }

            // Update sort order for each image
            const updatePromises = imageOrders.map((item: { id: string, sortOrder: number }) =>
                prisma.carouselImage.update({
                    where: { id: item.id },
                    data: { sortOrder: item.sortOrder }
                })
            )

            await Promise.all(updatePromises)

            res.json({
                success: true,
                message: 'Sort order updated successfully'
            })
        } catch (error) {
            console.error('Error updating sort order:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    // Toggle active status
    async toggleActive(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params

            // Check if carousel image exists
            const existingImage = await prisma.carouselImage.findUnique({
                where: { id }
            })

            if (!existingImage) {
                return res.status(404).json({
                    success: false,
                    message: 'Carousel image not found'
                })
            }

            // Toggle active status
            const updatedImage = await prisma.carouselImage.update({
                where: { id },
                data: { isActive: !existingImage.isActive }
            })

            res.json({
                success: true,
                message: `Carousel image ${updatedImage.isActive ? 'activated' : 'deactivated'} successfully`,
                data: updatedImage
            })
        } catch (error) {
            console.error('Error toggling carousel image status:', error)
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}