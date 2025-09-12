/**
 * Utility functions untuk menentukan status inovasi
 */

export interface InovasiStatus {
    hasProfilInovasi: boolean;
    hasIndikatorInovasi: boolean;
    stage: 'PROFIL_ONLY' | 'COMPLETE' | 'EMPTY';
    canCreateIndikator: boolean;
    nextAction: string;
}

/**
 * Menentukan status lengkap dari sebuah profil inovasi
 */
export const getInovasiStatus = (profilInovasi: any): InovasiStatus => {
    const hasProfilInovasi = !!profilInovasi;
    const hasIndikatorInovasi = !!(profilInovasi?.indikatorInovasi);

    let stage: InovasiStatus['stage'] = 'EMPTY';
    let canCreateIndikator = false;
    let nextAction = '';

    if (hasProfilInovasi && hasIndikatorInovasi) {
        stage = 'COMPLETE';
        canCreateIndikator = false;
        nextAction = 'Inovasi sudah lengkap dengan profil dan indikator';
    } else if (hasProfilInovasi && !hasIndikatorInovasi) {
        stage = 'PROFIL_ONLY';
        canCreateIndikator = true;
        nextAction = 'Lanjutkan dengan membuat Indikator Inovasi';
    } else {
        stage = 'EMPTY';
        canCreateIndikator = false;
        nextAction = 'Mulai dengan membuat Profil Inovasi terlebih dahulu';
    }

    return {
        hasProfilInovasi,
        hasIndikatorInovasi,
        stage,
        canCreateIndikator,
        nextAction
    };
};

/**
 * Validasi apakah user dapat membuat indikator inovasi
 */
export const canUserCreateIndikator = (
    profilInovasi: any,
    userId: string,
    userRole: string
): { canCreate: boolean; reason?: string } => {
    // Check if profil exists
    if (!profilInovasi) {
        return {
            canCreate: false,
            reason: 'Profil Inovasi tidak ditemukan'
        };
    }

    // Check if user has access
    if (userRole !== 'ADMIN' && profilInovasi.userId !== userId) {
        return {
            canCreate: false,
            reason: 'Anda tidak memiliki akses ke profil inovasi ini'
        };
    }

    // Check if indikator already exists
    if (profilInovasi.indikatorInovasi) {
        return {
            canCreate: false,
            reason: 'Indikator Inovasi sudah ada untuk profil ini'
        };
    }

    return { canCreate: true };
};

/**
 * Format response dengan status inovasi
 */
export const formatInovasiResponse = (data: any) => {
    if (Array.isArray(data)) {
        return data.map(item => ({
            ...item,
            status: getInovasiStatus(item)
        }));
    } else {
        return {
            ...data,
            status: getInovasiStatus(data)
        };
    }
};
