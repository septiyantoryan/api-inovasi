import { z } from 'zod';

// Register validation schema
export const registerSchema = z.object({
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
                'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 simbol (@$!%*?&_)'),

        nama: z
            .string({ message: 'Nama harus berupa string' })
            .min(2, 'Nama minimal 2 karakter')
            .max(100, 'Nama maksimal 100 karakter')
            .trim(),

        role: z
            .enum(['ADMIN', 'OPD'], { message: 'Role harus ADMIN atau OPD' })
            .optional()
            .default('OPD')
    })
});

// Login validation schema
export const loginSchema = z.object({
    body: z.object({
        username: z
            .string({ message: 'Username harus berupa string' })
            .min(1, 'Username tidak boleh kosong'),

        password: z
            .string({ message: 'Password harus berupa string' })
            .min(1, 'Password tidak boleh kosong')
    })
});

// Update profile validation schema
export const updateProfileSchema = z.object({
    body: z.object({
        nama: z
            .string({ message: 'Nama harus berupa string' })
            .min(2, 'Nama minimal 2 karakter')
            .max(100, 'Nama maksimal 100 karakter')
            .trim()
            .optional(),

        password: z
            .string({ message: 'Password harus berupa string' })
            .min(8, 'Password minimal 8 karakter')
            .max(100, 'Password maksimal 100 karakter')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
                'Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 simbol (@$!%*?&_)')
            .optional()
    })
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
