import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash passwords
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const opd1Password = await bcrypt.hash('opd123', saltRounds);
    const opd2Password = await bcrypt.hash('opd456', saltRounds);

    // Create Admin user
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            nama: 'Administrator',
            role: 'ADMIN',
            status: 'AKTIF'
        }
    });

    // Create OPD user 1 (Active)
    const opd1 = await prisma.user.upsert({
        where: { username: 'opd1' },
        update: {},
        create: {
            username: 'opd1',
            password: opd1Password,
            nama: 'OPD Dinas Kesehatan',
            role: 'OPD',
            status: 'AKTIF'
        }
    });

    // Create OPD user 2 (Inactive)
    const opd2 = await prisma.user.upsert({
        where: { username: 'opd2' },
        update: {},
        create: {
            username: 'opd2',
            password: opd2Password,
            nama: 'OPD Dinas Pendidikan',
            role: 'OPD',
            status: 'TIDAK_AKTIF'
        }
    });

    console.log('✅ Seed data created successfully:');
    console.log('📋 Users created:');
    console.log(`   1. Admin: ${admin.username} (${admin.nama}) - ${admin.status}`);
    console.log(`   2. OPD 1: ${opd1.username} (${opd1.nama}) - ${opd1.status}`);
    console.log(`   3. OPD 2: ${opd2.username} (${opd2.nama}) - ${opd2.status}`);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Admin: username="admin", password="admin123"');
    console.log('   OPD 1: username="opd1", password="opd123" (AKTIF)');
    console.log('   OPD 2: username="opd2", password="opd456" (TIDAK_AKTIF)');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
