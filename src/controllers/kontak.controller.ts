import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { kontakValidation, updateKontakValidation } from '../validations';

const prisma = new PrismaClient();

export class KontakController {
    // Get all kontak (public access)
    static async getAllKontak(req: Request, res: Response) {
        try {
            const kontak = await prisma.kontak.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Data kontak berhasil diambil',
                data: kontak
            });
        } catch (error) {
            console.error('Error fetching kontak:', error);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil data kontak',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Get kontak by ID (public access)
    static async getKontakById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const kontak = await prisma.kontak.findUnique({
                where: { id }
            });

            if (!kontak) {
                return res.status(404).json({
                    success: false,
                    message: 'Data kontak tidak ditemukan'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Data kontak berhasil diambil',
                data: kontak
            });
        } catch (error) {
            console.error('Error fetching kontak by ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mengambil data kontak',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Create new kontak (admin only)
    static async createKontak(req: Request, res: Response) {
        try {
            const validatedData = kontakValidation.parse(req.body);

            const kontak = await prisma.kontak.create({
                data: validatedData
            });

            return res.status(201).json({
                success: true,
                message: 'Data kontak berhasil dibuat',
                data: kontak
            });
        } catch (error) {
            console.error('Error creating kontak:', error);

            if (error instanceof Error && error.message.includes('validation')) {
                return res.status(400).json({
                    success: false,
                    message: 'Data tidak valid',
                    error: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat membuat data kontak',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Update kontak (admin only)
    static async updateKontak(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = updateKontakValidation.parse(req.body);

            // Check if kontak exists
            const existingKontak = await prisma.kontak.findUnique({
                where: { id }
            });

            if (!existingKontak) {
                return res.status(404).json({
                    success: false,
                    message: 'Data kontak tidak ditemukan'
                });
            }

            const updatedKontak = await prisma.kontak.update({
                where: { id },
                data: validatedData
            });

            return res.status(200).json({
                success: true,
                message: 'Data kontak berhasil diperbarui',
                data: updatedKontak
            });
        } catch (error) {
            console.error('Error updating kontak:', error);

            if (error instanceof Error && error.message.includes('validation')) {
                return res.status(400).json({
                    success: false,
                    message: 'Data tidak valid',
                    error: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat memperbarui data kontak',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Delete kontak (admin only) - hard delete
    static async deleteKontak(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Check if kontak exists
            const existingKontak = await prisma.kontak.findUnique({
                where: { id }
            });

            if (!existingKontak) {
                return res.status(404).json({
                    success: false,
                    message: 'Data kontak tidak ditemukan'
                });
            }

            // Hard delete
            await prisma.kontak.delete({
                where: { id }
            });

            return res.status(200).json({
                success: true,
                message: 'Data kontak berhasil dihapus'
            });
        } catch (error) {
            console.error('Error deleting kontak:', error);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat menghapus data kontak',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}