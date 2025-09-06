import { z } from 'zod';

// File/URL validation
const fileUrlSchema = z
    .string({ message: 'Field harus berupa string' })
    .min(1, 'Field tidak boleh kosong')
    .max(500, 'Field maksimal 500 karakter')
    .trim();

// Create IndikatorInovasi validation schema
export const createIndikatorInovasiSchema = z.object({
    body: z.object({
        profilInovasiId: z
            .string({ message: 'Profil inovasi ID harus berupa string' })
            .uuid('Profil inovasi ID harus berupa UUID yang valid'),

        regulasiInovasiDaerah: fileUrlSchema,
        ketersediaanSDM: fileUrlSchema,
        dukunganAnggaran: fileUrlSchema,
        alatKerja: fileUrlSchema,
        bimtekInovasi: fileUrlSchema,
        integrasiProgramRKPD: fileUrlSchema,
        keterlibatanAktorInovasi: fileUrlSchema,
        pelaksanaInovasiDaerah: fileUrlSchema,
        jejaringInovasi: fileUrlSchema,
        sosialisasiInovasiDaerah: fileUrlSchema,
        pedomanTeknis: fileUrlSchema,
        kemudahanInformasiLayanan: fileUrlSchema,
        kemudahanProsesInovasi: fileUrlSchema,
        penyelesaianLayananPengaduan: fileUrlSchema,
        layananTerintegrasi: fileUrlSchema,
        replikasi: fileUrlSchema,
        kecepatanPenciptaanInovasi: fileUrlSchema,
        kemanfaatanInovasi: fileUrlSchema,
        monitoringEvaluasiInovasiDaerah: fileUrlSchema,
        kualitasInovasiDaerah: z
            .string({ message: 'Kualitas inovasi daerah harus berupa string' })
            .url('Kualitas inovasi daerah harus berupa URL YouTube yang valid')
            .regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//, 'Harus berupa URL YouTube yang valid')
    })
});

// Update IndikatorInovasi validation schema
export const updateIndikatorInovasiSchema = z.object({
    body: z.object({
        regulasiInovasiDaerah: fileUrlSchema.optional(),
        ketersediaanSDM: fileUrlSchema.optional(),
        dukunganAnggaran: fileUrlSchema.optional(),
        alatKerja: fileUrlSchema.optional(),
        bimtekInovasi: fileUrlSchema.optional(),
        integrasiProgramRKPD: fileUrlSchema.optional(),
        keterlibatanAktorInovasi: fileUrlSchema.optional(),
        pelaksanaInovasiDaerah: fileUrlSchema.optional(),
        jejaringInovasi: fileUrlSchema.optional(),
        sosialisasiInovasiDaerah: fileUrlSchema.optional(),
        pedomanTeknis: fileUrlSchema.optional(),
        kemudahanInformasiLayanan: fileUrlSchema.optional(),
        kemudahanProsesInovasi: fileUrlSchema.optional(),
        penyelesaianLayananPengaduan: fileUrlSchema.optional(),
        layananTerintegrasi: fileUrlSchema.optional(),
        replikasi: fileUrlSchema.optional(),
        kecepatanPenciptaanInovasi: fileUrlSchema.optional(),
        kemanfaatanInovasi: fileUrlSchema.optional(),
        monitoringEvaluasiInovasiDaerah: fileUrlSchema.optional(),
        kualitasInovasiDaerah: z
            .string({ message: 'Kualitas inovasi daerah harus berupa string' })
            .url('Kualitas inovasi daerah harus berupa URL YouTube yang valid')
            .regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//, 'Harus berupa URL YouTube yang valid')
            .optional()
    })
});

// Params validation for get/update/delete operations
export const indikatorInovasiParamsSchema = z.object({
    params: z.object({
        id: z
            .string({ message: 'ID harus berupa string' })
            .uuid('ID harus berupa UUID yang valid')
    })
});

// Params validation for get by profil ID
export const indikatorInovasiProfilParamsSchema = z.object({
    params: z.object({
        profilInovasiId: z
            .string({ message: 'Profil inovasi ID harus berupa string' })
            .uuid('Profil inovasi ID harus berupa UUID yang valid')
    })
});

// Query validation for filtering IndikatorInovasi
export const indikatorInovasiQuerySchema = z.object({
    query: z.object({
        profilInovasiId: z
            .string({ message: 'Profil inovasi ID harus berupa string' })
            .uuid('Profil inovasi ID harus berupa UUID yang valid')
            .optional(),

        page: z
            .string()
            .optional()
            .default('1')
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0, {
                message: 'Page harus berupa angka positif'
            }),

        limit: z
            .string()
            .optional()
            .default('10')
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
                message: 'Limit harus berupa angka antara 1-100'
            })
    })
});

// Types
export type CreateIndikatorInovasiInput = z.infer<typeof createIndikatorInovasiSchema>['body'];
export type UpdateIndikatorInovasiInput = z.infer<typeof updateIndikatorInovasiSchema>['body'];
export type IndikatorInovasiParams = z.infer<typeof indikatorInovasiParamsSchema>['params'];
export type IndikatorInovasiProfilParams = z.infer<typeof indikatorInovasiProfilParamsSchema>['params'];
export type IndikatorInovasiQuery = z.infer<typeof indikatorInovasiQuerySchema>['query'];
