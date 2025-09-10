import { z } from 'zod';

// ProfilInovasi validation schema
export const createProfilInovasiSchema = z.object({
    body: z.object({
        namaInovasi: z
            .string({ message: 'Nama inovasi harus berupa string' })
            .min(3, 'Nama inovasi minimal 3 karakter')
            .max(200, 'Nama inovasi maksimal 200 karakter')
            .trim(),

        inovator: z
            .string({ message: 'Inovator harus berupa string' })
            .min(2, 'Inovator minimal 2 karakter')
            .max(100, 'Inovator maksimal 100 karakter')
            .trim(),

        jenisInovasi: z
            .enum(['DIGITAL', 'NON_DIGITAL'], {
                message: 'Jenis inovasi harus DIGITAL atau NON_DIGITAL'
            }),

        bentukInovasi: z
            .string({ message: 'Bentuk inovasi harus berupa string' })
            .min(3, 'Bentuk inovasi minimal 3 karakter')
            .max(100, 'Bentuk inovasi maksimal 100 karakter')
            .trim(),

        tanggalUjiCoba: z
            .string({ message: 'Tanggal uji coba harus berupa string' })
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'Format tanggal uji coba tidak valid'
            }),

        tanggalPenerapan: z
            .string({ message: 'Tanggal penerapan harus berupa string' })
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'Format tanggal penerapan tidak valid'
            }),

        rancangBangun: z
            .string({ message: 'Rancang bangun harus berupa string' })
            .min(300, 'Rancang bangun minimal 300 karakter')
            .max(5000, 'Rancang bangun maksimal 5000 karakter')
            .trim(),

        tujuanInovasi: z
            .string({ message: 'Tujuan inovasi harus berupa string' })
            .min(10, 'Tujuan inovasi minimal 10 karakter')
            .max(2000, 'Tujuan inovasi maksimal 2000 karakter')
            .trim(),

        manfaatInovasi: z
            .string({ message: 'Manfaat inovasi harus berupa string' })
            .min(10, 'Manfaat inovasi minimal 10 karakter')
            .max(2000, 'Manfaat inovasi maksimal 2000 karakter')
            .trim(),

        hasilInovasi: z
            .string({ message: 'Hasil inovasi harus berupa string' })
            .min(10, 'Hasil inovasi minimal 10 karakter')
            .max(2000, 'Hasil inovasi maksimal 2000 karakter')
            .trim()
    })
        .refine((data) => {
            const tanggalUjiCoba = new Date(data.tanggalUjiCoba);
            const tanggalPenerapan = new Date(data.tanggalPenerapan);
            return tanggalUjiCoba <= tanggalPenerapan;
        }, {
            message: 'Tanggal uji coba harus sebelum atau sama dengan tanggal penerapan',
            path: ['tanggalPenerapan']
        })
});

// Update ProfilInovasi validation schema
export const updateProfilInovasiSchema = z.object({
    body: z.object({
        namaInovasi: z
            .string({ message: 'Nama inovasi harus berupa string' })
            .min(3, 'Nama inovasi minimal 3 karakter')
            .max(200, 'Nama inovasi maksimal 200 karakter')
            .trim()
            .optional(),

        inovator: z
            .string({ message: 'Inovator harus berupa string' })
            .min(2, 'Inovator minimal 2 karakter')
            .max(100, 'Inovator maksimal 100 karakter')
            .trim()
            .optional(),

        jenisInovasi: z
            .enum(['DIGITAL', 'NON_DIGITAL'], {
                message: 'Jenis inovasi harus DIGITAL atau NON_DIGITAL'
            })
            .optional(),

        bentukInovasi: z
            .string({ message: 'Bentuk inovasi harus berupa string' })
            .min(3, 'Bentuk inovasi minimal 3 karakter')
            .max(100, 'Bentuk inovasi maksimal 100 karakter')
            .trim()
            .optional(),

        tanggalUjiCoba: z
            .string({ message: 'Tanggal uji coba harus berupa string' })
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'Format tanggal uji coba tidak valid'
            })
            .optional(),

        tanggalPenerapan: z
            .string({ message: 'Tanggal penerapan harus berupa string' })
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'Format tanggal penerapan tidak valid'
            })
            .optional(),

        rancangBangun: z
            .string({ message: 'Rancang bangun harus berupa string' })
            .min(300, 'Rancang bangun minimal 300 karakter')
            .max(5000, 'Rancang bangun maksimal 5000 karakter')
            .trim()
            .optional(),

        tujuanInovasi: z
            .string({ message: 'Tujuan inovasi harus berupa string' })
            .min(10, 'Tujuan inovasi minimal 10 karakter')
            .max(2000, 'Tujuan inovasi maksimal 2000 karakter')
            .trim()
            .optional(),

        manfaatInovasi: z
            .string({ message: 'Manfaat inovasi harus berupa string' })
            .min(10, 'Manfaat inovasi minimal 10 karakter')
            .max(2000, 'Manfaat inovasi maksimal 2000 karakter')
            .trim()
            .optional(),

        hasilInovasi: z
            .string({ message: 'Hasil inovasi harus berupa string' })
            .min(10, 'Hasil inovasi minimal 10 karakter')
            .max(2000, 'Hasil inovasi maksimal 2000 karakter')
            .trim()
            .optional()
    })
        .refine((data) => {
            if (data.tanggalUjiCoba && data.tanggalPenerapan) {
                const tanggalUjiCoba = new Date(data.tanggalUjiCoba);
                const tanggalPenerapan = new Date(data.tanggalPenerapan);
                return tanggalUjiCoba <= tanggalPenerapan;
            }
            return true;
        }, {
            message: 'Tanggal uji coba harus sebelum atau sama dengan tanggal penerapan',
            path: ['tanggalPenerapan']
        })
});

// Params validation for get/update/delete operations
export const profilInovasiParamsSchema = z.object({
    params: z.object({
        id: z
            .string({ message: 'ID harus berupa string' })
            .uuid('ID harus berupa UUID yang valid')
    })
});

// Types
export type CreateProfilInovasiInput = z.infer<typeof createProfilInovasiSchema>['body'];
export type UpdateProfilInovasiInput = z.infer<typeof updateProfilInovasiSchema>['body'];
export type ProfilInovasiParams = z.infer<typeof profilInovasiParamsSchema>['params'];
