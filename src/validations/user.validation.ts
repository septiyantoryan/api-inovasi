import { z } from 'zod';

// Create user validation schema
export const createUserSchema = z.object({
    body: z.object({
        username: z
            .string({ message: 'Username harus berupa string' })
            .min(4, 'Username minimal 4 karakter')
            .max(20, 'Username maksimal 20 karakter')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore'),

        password: z
            .string({ message: 'Password harus berupa string' })
            .min(8, 'Password minimal 8 karakter')
            .max(100, 'Password maksimal 100 karakter')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
                'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 simbol'),

        nama: z
            .string({ message: 'Nama harus berupa string' })
            .min(2, 'Nama minimal 2 karakter')
            .max(100, 'Nama maksimal 100 karakter')
            .trim(),

        role: z
            .enum(['ADMIN', 'OPD'], { message: 'Role harus ADMIN atau OPD' })
            .default('OPD')
    })
});

// Update user validation schema
export const updateUserSchema = z.object({
    body: z.object({
        username: z
            .string({ message: 'Username harus berupa string' })
            .min(4, 'Username minimal 4 karakter')
            .max(20, 'Username maksimal 20 karakter')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore')
            .optional(),

        nama: z
            .string({ message: 'Nama harus berupa string' })
            .min(2, 'Nama minimal 2 karakter')
            .max(100, 'Nama maksimal 100 karakter')
            .trim()
            .optional(),

        role: z
            .enum(['ADMIN', 'OPD'], { message: 'Role harus ADMIN atau OPD' })
            .optional(),

        status: z
            .enum(['AKTIF', 'TIDAK_AKTIF'], { message: 'Status harus AKTIF atau TIDAK_AKTIF' })
            .optional()
    })
});

// Change password validation schema
export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z
            .string({ message: 'Password lama harus berupa string' })
            .min(1, 'Password lama tidak boleh kosong'),

        newPassword: z
            .string({ message: 'Password baru harus berupa string' })
            .min(8, 'Password baru minimal 8 karakter')
            .max(100, 'Password baru maksimal 100 karakter')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
                'Password baru harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 simbol'),

        confirmPassword: z
            .string({ message: 'Konfirmasi password harus berupa string' })
            .min(1, 'Konfirmasi password tidak boleh kosong')
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Konfirmasi password tidak sesuai',
        path: ['confirmPassword']
    })
});

// Get users query validation schema
export const getUsersQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return 1;
                const parsed = parseInt(val);
                return isNaN(parsed) ? 1 : parsed;
            })
            .refine((val) => val > 0, 'Page harus lebih dari 0'),

        limit: z
            .string()
            .optional()
            .transform((val) => {
                if (!val) return 10;
                const parsed = parseInt(val);
                return isNaN(parsed) ? 10 : parsed;
            })
            .refine((val) => val > 0 && val <= 100, 'Limit harus antara 1-100'),

        search: z
            .string()
            .optional()
            .transform((val) => val?.trim() || undefined),

        role: z
            .enum(['ADMIN', 'OPD'])
            .optional(),

        status: z
            .enum(['AKTIF', 'TIDAK_AKTIF'])
            .optional(),

        sortBy: z
            .enum(['username', 'nama', 'role', 'status', 'createdAt'])
            .optional()
            .default('createdAt'),

        sortOrder: z
            .enum(['asc', 'desc'])
            .optional()
            .default('desc')
    })
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
