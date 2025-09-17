import { z } from 'zod';

export const kontakValidation = z.object({
    namaDinas: z.string()
        .min(1, 'Nama dinas wajib diisi'),

    alamat: z.string()
        .min(1, 'Alamat wajib diisi'),

    telepon: z.string()
        .min(1, 'Telepon wajib diisi')
        .regex(/^[0-9\-\+\(\)\s]+$/, 'Format nomor telepon tidak valid'),

    email: z.string()
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),

    kodePos: z.string()
        .min(1, 'Kode pos wajib diisi')
        .regex(/^[0-9]+$/, 'Kode pos hanya boleh berisi angka'),

    latitude: z.string()
        .min(1, 'Latitude wajib diisi')
        .regex(/^-?([0-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/, 'Format latitude tidak valid (-90 to 90)'),

    longitude: z.string()
        .min(1, 'Longitude wajib diisi')
        .regex(/^-?((1?[0-7]?|[0-9]?)[0-9](\.[0-9]+)?|180(\.0+)?)$/, 'Format longitude tidak valid (-180 to 180)')
});

export const updateKontakValidation = z.object({
    namaDinas: z.string()
        .min(1, 'Nama dinas wajib diisi')
        .optional(),

    alamat: z.string()
        .min(1, 'Alamat wajib diisi')
        .optional(),

    telepon: z.string()
        .min(1, 'Telepon wajib diisi')
        .regex(/^[0-9\-\+\(\)\s]+$/, 'Format nomor telepon tidak valid')
        .optional(),

    email: z.string()
        .email('Format email tidak valid')
        .optional(),

    kodePos: z.string()
        .regex(/^[0-9]+$/, 'Kode pos hanya boleh berisi angka')
        .optional(),

    latitude: z.string()
        .regex(/^-?([0-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/, 'Format latitude tidak valid (-90 to 90)')
        .optional(),

    longitude: z.string()
        .regex(/^-?((1?[0-7]?|[0-9]?)[0-9](\.[0-9]+)?|180(\.0+)?)$/, 'Format longitude tidak valid (-180 to 180)')
        .optional()
});

export type KontakInput = z.infer<typeof kontakValidation>;
export type UpdateKontakInput = z.infer<typeof updateKontakValidation>;