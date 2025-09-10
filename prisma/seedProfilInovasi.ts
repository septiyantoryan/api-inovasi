import { PrismaClient, JenisInovasi } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting profil inovasi seed...');

    // Get existing users to assign profil inovasi to them
    const users = await prisma.user.findMany({
        where: {
            role: 'OPD',
            status: 'AKTIF'
        }
    });

    if (users.length === 0) {
        console.error('❌ No OPD users found. Please run the main seed first.');
        return;
    }

    const profilInovasiData = [
        {
            namaInovasi: 'Sistem Informasi Pelayanan Terpadu (SIPT)',
            inovator: 'Tim IT Dinas Komunikasi dan Informatika',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sistem Informasi',
            tanggalUjiCoba: new Date('2024-01-15'),
            tanggalPenerapan: new Date('2024-03-01'),
            rancangBangun: 'Sistem pelayanan terpadu berbasis web yang mengintegrasikan berbagai layanan publik dalam satu platform. Menggunakan teknologi React.js untuk frontend dan Node.js untuk backend dengan database MySQL.',
            tujuanInovasi: 'Menciptakan sistem pelayanan publik yang terintegrasi, efisien, dan mudah diakses oleh masyarakat untuk meningkatkan kualitas pelayanan pemerintah dan mewujudkan good governance.',
            manfaatInovasi: 'Mempercepat proses pelayanan publik, mengurangi antrian, meningkatkan transparansi, dan memudahkan akses masyarakat terhadap berbagai layanan pemerintah.',
            hasilInovasi: 'Berhasil mengurangi waktu pelayanan dari rata-rata 3 hari menjadi 1 hari, meningkatkan kepuasan masyarakat sebesar 85%, dan mengurangi penggunaan kertas sebanyak 70%.'
        },
        {
            namaInovasi: 'E-Perizinan Online',
            inovator: 'DPMPTSP Kabupaten Grobogan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi Web',
            tanggalUjiCoba: new Date('2024-02-01'),
            tanggalPenerapan: new Date('2024-04-15'),
            rancangBangun: 'Platform digital untuk pengurusan izin usaha dan non-usaha secara online. Dilengkapi dengan sistem tracking, notifikasi otomatis, dan integrasi pembayaran digital.',
            tujuanInovasi: 'Menyederhanakan dan mempercepat proses perizinan melalui digitalisasi layanan untuk mendukung kemudahan berusaha dan meningkatkan iklim investasi daerah.',
            manfaatInovasi: 'Memudahkan masyarakat mengurus perizinan tanpa datang ke kantor, proses lebih transparan dan dapat dipantau real-time, mengurangi praktik percaloan.',
            hasilInovasi: 'Peningkatan jumlah permohonan izin sebesar 120%, waktu pengurusan izin berkurang 60%, dan tingkat kepuasan mencapai 90%.'
        },
        {
            namaInovasi: 'Mobile Health Monitoring System',
            inovator: 'Dinas Kesehatan Kabupaten Grobogan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi Mobile',
            tanggalUjiCoba: new Date('2024-01-20'),
            tanggalPenerapan: new Date('2024-03-15'),
            rancangBangun: 'Aplikasi mobile untuk monitoring kesehatan masyarakat secara real-time. Menghubungkan puskesmas, rumah sakit, dan posyandu dalam satu sistem terintegrasi.',
            tujuanInovasi: 'Meningkatkan sistem monitoring kesehatan masyarakat secara terpadu dan real-time untuk mewujudkan pelayanan kesehatan yang berkualitas dan merata di seluruh wilayah.',
            manfaatInovasi: 'Memudahkan monitoring kesehatan masyarakat, deteksi dini penyakit, peningkatan kualitas pelayanan kesehatan, dan koordinasi antar fasilitas kesehatan.',
            hasilInovasi: 'Cakupan imunisasi meningkat 25%, waktu respon darurat medis berkurang 40%, dan angka kesakitan turun 15%.'
        },
        {
            namaInovasi: 'Smart Village Information System',
            inovator: 'Bagian Pemerintahan Desa',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Portal Web',
            tanggalUjiCoba: new Date('2024-02-10'),
            tanggalPenerapan: new Date('2024-05-01'),
            rancangBangun: 'Portal informasi desa yang menyediakan layanan administrasi desa online, informasi program desa, dan sistem pelaporan dana desa yang transparan.',
            tujuanInovasi: 'Membangun tata kelola pemerintahan desa yang transparan dan akuntabel melalui digitalisasi layanan serta meningkatkan partisipasi masyarakat dalam pembangunan desa.',
            manfaatInovasi: 'Meningkatkan transparansi pengelolaan dana desa, memudahkan warga mengakses layanan desa, dan memperkuat partisipasi masyarakat dalam pembangunan desa.',
            hasilInovasi: 'Partisipasi masyarakat dalam musrenbangdes meningkat 45%, transparansi APBDes mencapai 95%, dan kepuasan layanan desa naik 80%.'
        },
        {
            namaInovasi: 'Sistem Pengelolaan Sampah Terpadu',
            inovator: 'Dinas Lingkungan Hidup',
            jenisInovasi: 'NON_DIGITAL',
            bentukInovasi: 'Inovasi Proses',
            tanggalUjiCoba: new Date('2024-01-05'),
            tanggalPenerapan: new Date('2024-04-01'),
            rancangBangun: 'Sistem pengelolaan sampah 3R (Reduce, Reuse, Recycle) dengan melibatkan bank sampah, composting center, dan unit pengolahan sampah organik di tingkat RT/RW.',
            tujuanInovasi: 'Menciptakan sistem pengelolaan sampah yang berkelanjutan dan ramah lingkungan melalui pendekatan ekonomi sirkular untuk mengurangi beban TPA dan meningkatkan kesadaran lingkungan.',
            manfaatInovasi: 'Mengurangi volume sampah ke TPA, menciptakan ekonomi circular, meningkatkan kesadaran lingkungan masyarakat, dan menciptakan lapangan kerja baru.',
            hasilInovasi: 'Volume sampah ke TPA berkurang 35%, pendapatan bank sampah meningkat 200%, dan partisipasi masyarakat dalam pengelolaan sampah naik 65%.'
        },
        {
            namaInovasi: 'Program Sekolah Inklusi Digital',
            inovator: 'Dinas Pendidikan Kabupaten Grobogan',
            jenisInovasi: 'NON_DIGITAL',
            bentukInovasi: 'Inovasi Program',
            tanggalUjiCoba: new Date('2024-02-15'),
            tanggalPenerapan: new Date('2024-07-01'),
            rancangBangun: 'Program pendidikan yang mengintegrasikan teknologi digital dengan pembelajaran konvensional, meliputi pelatihan guru, penyediaan perangkat, dan kurikulum digital.',
            tujuanInovasi: 'Mewujudkan pendidikan yang inklusif dan berkualitas melalui integrasi teknologi digital untuk meningkatkan kompetensi siswa dan guru di era digital.',
            manfaatInovasi: 'Meningkatkan literasi digital siswa dan guru, memperbaiki kualitas pembelajaran, dan mengurangi kesenjangan akses pendidikan.',
            hasilInovasi: 'Kemampuan digital siswa meningkat 70%, nilai UN rata-rata naik 15 poin, dan 95% guru menguasai teknologi pembelajaran digital.'
        },
        {
            namaInovasi: 'E-Agriculture Advisory System',
            inovator: 'Dinas Pertanian dan Pangan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi Mobile',
            tanggalUjiCoba: new Date('2024-03-01'),
            tanggalPenerapan: new Date('2024-06-15'),
            rancangBangun: 'Aplikasi mobile yang menyediakan informasi cuaca, harga komoditas, teknik budidaya, dan konsultasi pertanian online dengan ahli.',
            tujuanInovasi: 'Meningkatkan produktivitas dan kesejahteraan petani melalui penyediaan informasi pertanian yang akurat dan layanan konsultasi digital untuk mendukung ketahanan pangan daerah.',
            manfaatInovasi: 'Meningkatkan produktivitas pertanian, membantu petani dalam pengambilan keputusan, dan mempercepat transfer teknologi pertanian.',
            hasilInovasi: 'Produktivitas padi meningkat 20%, pendapatan petani naik 30%, dan adopsi teknologi pertanian modern meningkat 50%.'
        },
        {
            namaInovasi: 'Integrated Tourism Information Portal',
            inovator: 'Dinas Pariwisata dan Kebudayaan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Website dan Mobile App',
            tanggalUjiCoba: new Date('2024-02-20'),
            tanggalPenerapan: new Date('2024-05-15'),
            rancangBangun: 'Platform digital yang mengintegrasikan informasi wisata, booking hotel, peta wisata interaktif, dan promosi event budaya dalam satu aplikasi.',
            tujuanInovasi: 'Mengembangkan potensi pariwisata daerah melalui digitalisasi informasi dan layanan untuk meningkatkan kunjungan wisatawan dan pertumbuhan ekonomi lokal.',
            manfaatInovasi: 'Meningkatkan promosi wisata daerah, memudahkan wisatawan dalam perencanaan kunjungan, dan mendukung ekonomi lokal.',
            hasilInovasi: 'Kunjungan wisatawan meningkat 40%, pendapatan sektor pariwisata naik 35%, dan UMKM di sekitar objek wisata berkembang 60%.'
        },
        {
            namaInovasi: 'Smart Traffic Management System',
            inovator: 'Dinas Perhubungan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sistem IoT',
            tanggalUjiCoba: new Date('2024-03-10'),
            tanggalPenerapan: new Date('2024-07-01'),
            rancangBangun: 'Sistem manajemen lalu lintas pintar menggunakan sensor IoT, kamera CCTV, dan AI untuk monitoring dan pengaturan lalu lintas secara otomatis.',
            tujuanInovasi: 'Menciptakan sistem transportasi yang efisien dan aman melalui teknologi pintar untuk mengurangi kemacetan dan meningkatkan keselamatan jalan.',
            manfaatInovasi: 'Mengurangi kemacetan, meningkatkan keselamatan jalan, mengoptimalkan flow traffic, dan mengurangi emisi kendaraan.',
            hasilInovasi: 'Waktu tempuh rata-rata berkurang 25%, tingkat kecelakaan turun 30%, dan emisi CO2 berkurang 20%.'
        },
        {
            namaInovasi: 'Community-Based Social Protection',
            inovator: 'Dinas Sosial',
            jenisInovasi: 'NON_DIGITAL',
            bentukInovasi: 'Inovasi Program',
            tanggalUjiCoba: new Date('2024-01-10'),
            tanggalPenerapan: new Date('2024-04-01'),
            rancangBangun: 'Program perlindungan sosial berbasis masyarakat yang melibatkan kader sosial, sistem rujukan terintegrasi, dan mekanisme bantuan cepat tanggap.',
            tujuanInovasi: 'Membangun sistem perlindungan sosial yang responsif dan berkelanjutan dengan melibatkan partisipasi masyarakat untuk menjamin kesejahteraan kelompok rentan.',
            manfaatInovasi: 'Meningkatkan responsivitas bantuan sosial, memperkuat solidaritas masyarakat, dan memastikan bantuan tepat sasaran.',
            hasilInovasi: 'Waktu respon bantuan sosial berkurang 50%, akurasi data penerima bantuan mencapai 95%, dan kepuasan penerima bantuan naik 85%.'
        },
        {
            namaInovasi: 'Digital Financial Literacy Program',
            inovator: 'Bappeda Kabupaten Grobogan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Platform Edukasi',
            tanggalUjiCoba: new Date('2024-02-25'),
            tanggalPenerapan: new Date('2024-06-01'),
            rancangBangun: 'Platform edukasi keuangan digital dengan konten interaktif, simulasi investasi, dan tracking progress pembelajaran untuk meningkatkan literasi keuangan masyarakat.',
            tujuanInovasi: 'Meningkatkan literasi keuangan masyarakat melalui edukasi digital untuk mendorong inklusi keuangan dan melindungi masyarakat dari risiko penipuan finansial.',
            manfaatInovasi: 'Meningkatkan pemahaman masyarakat tentang keuangan digital, mengurangi risiko penipuan online, dan mendorong inklusi keuangan.',
            hasilInovasi: 'Literasi keuangan masyarakat meningkat 60%, penggunaan layanan keuangan digital naik 80%, dan kasus penipuan finansial turun 40%.'
        },
        {
            namaInovasi: 'Renewable Energy Village Program',
            inovator: 'Dinas ESDM',
            jenisInovasi: 'NON_DIGITAL',
            bentukInovasi: 'Inovasi Teknologi',
            tanggalUjiCoba: new Date('2024-03-05'),
            tanggalPenerapan: new Date('2024-08-01'),
            rancangBangun: 'Program pengembangan desa mandiri energi dengan instalasi panel surya, biogas, dan microhydro, disertai pelatihan maintenance dan manajemen energi.',
            tujuanInovasi: 'Mewujudkan kemandirian energi desa melalui pemanfaatan energi terbarukan untuk mendukung pembangunan berkelanjutan dan mengurangi emisi karbon.',
            manfaatInovasi: 'Mengurangi ketergantungan pada energi fosil, menghemat biaya listrik masyarakat, dan menciptakan lapangan kerja hijau.',
            hasilInovasi: 'Penggunaan energi terbarukan meningkat 40%, penghematan biaya listrik 35%, dan emisi karbon berkurang 45%.'
        },
        {
            namaInovasi: 'Integrated Emergency Response System',
            inovator: 'BPBD Kabupaten Grobogan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sistem Terintegrasi',
            tanggalUjiCoba: new Date('2024-01-30'),
            tanggalPenerapan: new Date('2024-05-01'),
            rancangBangun: 'Sistem tanggap darurat terintegrasi dengan early warning system, koordinasi multi-agensi, dan aplikasi pelaporan masyarakat untuk bencana alam.',
            tujuanInovasi: 'Membangun sistem penanggulangan bencana yang terintegrasi dan responsif untuk meminimalkan risiko korban jiwa dan kerugian material akibat bencana alam.',
            manfaatInovasi: 'Mempercepat respon bencana, meningkatkan koordinasi antar instansi, dan mengurangi risiko korban jiwa.',
            hasilInovasi: 'Waktu respon darurat berkurang 60%, koordinasi antar lembaga meningkat 90%, dan tingkat kesiapsiagaan masyarakat naik 75%.'
        },
        {
            namaInovasi: 'Youth Innovation Incubator',
            inovator: 'Dinas Pemuda dan Olahraga',
            jenisInovasi: 'NON_DIGITAL',
            bentukInovasi: 'Program Inkubasi',
            tanggalUjiCoba: new Date('2024-03-15'),
            tanggalPenerapan: new Date('2024-07-15'),
            rancangBangun: 'Program inkubasi untuk pengembangan startup dan inovasi pemuda, meliputi mentoring, funding, dan networking dengan industri.',
            tujuanInovasi: 'Mengembangkan potensi inovasi dan kewirausahaan pemuda untuk menciptakan startup lokal yang berkelanjutan dan mengurangi tingkat pengangguran.',
            manfaatInovasi: 'Mengembangkan jiwa entrepreneurship pemuda, menciptakan startup lokal, dan mengurangi angka pengangguran.',
            hasilInovasi: '50 startup baru terbentuk, tingkat pengangguran pemuda turun 25%, dan investasi di sektor teknologi meningkat 150%.'
        },
        {
            namaInovasi: 'Integrated Water Management System',
            inovator: 'Dinas PUPR',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sistem Monitoring',
            tanggalUjiCoba: new Date('2024-02-05'),
            tanggalPenerapan: new Date('2024-06-01'),
            rancangBangun: 'Sistem manajemen air terpadu dengan sensor IoT untuk monitoring kualitas air, debit sungai, dan prediksi banjir berbasis AI.',
            tujuanInovasi: 'Mengoptimalkan pengelolaan sumber daya air secara berkelanjutan dan efisien untuk menjamin ketersediaan air bersih dan mencegah bencana hidrometeorologi.',
            manfaatInovasi: 'Meningkatkan efisiensi pengelolaan sumber daya air, mencegah banjir, dan memastikan kualitas air bersih untuk masyarakat.',
            hasilInovasi: 'Efisiensi distribusi air meningkat 30%, kejadian banjir berkurang 50%, dan kualitas air minum memenuhi standar 98%.'
        },
        {
            namaInovasi: 'Smart Traffic Control System',
            inovator: 'Dinas Perhubungan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi & Sensor',
            tanggalUjiCoba: new Date('2024-01-15'),
            tanggalPenerapan: new Date('2024-05-10'),
            rancangBangun: 'Sistem pengaturan lalu lintas berbasis AI dengan sensor kamera dan IoT untuk mengatur lampu lalu lintas secara adaptif.',
            tujuanInovasi: 'Mengurangi kemacetan dan meningkatkan kelancaran transportasi perkotaan.',
            manfaatInovasi: 'Waktu tempuh kendaraan berkurang, efisiensi bahan bakar meningkat, polusi udara menurun.',
            hasilInovasi: 'Kemacetan menurun 35%, waktu tempuh rata-rata berkurang 20%, emisi CO2 menurun 15%.'
        },
        {
            namaInovasi: 'E-Health Monitoring Platform',
            inovator: 'Dinas Kesehatan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Platform Digital',
            tanggalUjiCoba: new Date('2024-03-01'),
            tanggalPenerapan: new Date('2024-07-01'),
            rancangBangun: 'Aplikasi kesehatan untuk monitoring pasien penyakit kronis dengan integrasi wearable device.',
            tujuanInovasi: 'Memantau kondisi pasien secara real-time dan mencegah komplikasi kesehatan.',
            manfaatInovasi: 'Perawatan lebih cepat, efisiensi tenaga medis meningkat, angka komplikasi menurun.',
            hasilInovasi: 'Respon medis lebih cepat 40%, komplikasi pasien menurun 25%, kepuasan pasien meningkat 90%.'
        },
        {
            namaInovasi: 'Green Energy Street Lighting',
            inovator: 'Dinas Lingkungan Hidup',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Infrastruktur',
            tanggalUjiCoba: new Date('2024-02-20'),
            tanggalPenerapan: new Date('2024-06-15'),
            rancangBangun: 'Lampu jalan tenaga surya dengan sensor cahaya otomatis dan baterai penyimpanan.',
            tujuanInovasi: 'Mengurangi konsumsi listrik dari jaringan PLN dan memanfaatkan energi terbarukan.',
            manfaatInovasi: 'Penghematan biaya listrik daerah, lingkungan lebih ramah energi.',
            hasilInovasi: 'Biaya listrik lampu jalan turun 60%, emisi karbon berkurang 40%.'
        },
        {
            namaInovasi: 'E-Permit System',
            inovator: 'Dinas Penanaman Modal dan PTSP',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi Web',
            tanggalUjiCoba: new Date('2024-01-10'),
            tanggalPenerapan: new Date('2024-04-05'),
            rancangBangun: 'Sistem perizinan online berbasis web dengan fitur tracking dan validasi digital.',
            tujuanInovasi: 'Mempercepat proses perizinan dan meningkatkan transparansi pelayanan.',
            manfaatInovasi: 'Proses izin lebih cepat, mengurangi tatap muka, mencegah pungutan liar.',
            hasilInovasi: 'Waktu pengurusan izin turun 50%, kepuasan investor naik 85%.'
        },
        {
            namaInovasi: 'Smart Farming IoT',
            inovator: 'Dinas Pertanian',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sensor & Aplikasi',
            tanggalUjiCoba: new Date('2024-02-01'),
            tanggalPenerapan: new Date('2024-05-20'),
            rancangBangun: 'Sistem pertanian berbasis IoT untuk monitoring kelembaban tanah, suhu, dan kebutuhan pupuk.',
            tujuanInovasi: 'Meningkatkan produktivitas pertanian dengan penggunaan teknologi digital.',
            manfaatInovasi: 'Efisiensi penggunaan pupuk, air, dan peningkatan hasil panen.',
            hasilInovasi: 'Produksi meningkat 25%, penggunaan air hemat 30%, biaya pupuk berkurang 20%.'
        },
        {
            namaInovasi: 'Disaster Early Warning System',
            inovator: 'BPBD',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Sistem Peringatan',
            tanggalUjiCoba: new Date('2024-03-05'),
            tanggalPenerapan: new Date('2024-07-01'),
            rancangBangun: 'Sistem peringatan dini bencana berbasis sensor seismik, cuaca, dan aplikasi notifikasi masyarakat.',
            tujuanInovasi: 'Meminimalkan dampak bencana dengan peringatan dini yang akurat.',
            manfaatInovasi: 'Masyarakat lebih siap menghadapi bencana, korban dan kerugian dapat ditekan.',
            hasilInovasi: 'Respon evakuasi meningkat 70%, korban jiwa berkurang signifikan pada simulasi uji coba.'
        },
        {
            namaInovasi: 'Waste to Energy Plant',
            inovator: 'Dinas Kebersihan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Infrastruktur',
            tanggalUjiCoba: new Date('2024-04-01'),
            tanggalPenerapan: new Date('2024-08-01'),
            rancangBangun: 'Pembangkit listrik tenaga sampah dengan teknologi insinerasi ramah lingkungan.',
            tujuanInovasi: 'Mengurangi volume sampah dan menghasilkan energi listrik alternatif.',
            manfaatInovasi: 'Kebersihan kota meningkat, suplai listrik terbarukan bertambah.',
            hasilInovasi: 'Volume sampah berkurang 40%, listrik yang dihasilkan cukup untuk 10.000 rumah tangga.'
        },
        {
            namaInovasi: 'Digital School Platform',
            inovator: 'Dinas Pendidikan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Platform E-Learning',
            tanggalUjiCoba: new Date('2024-01-25'),
            tanggalPenerapan: new Date('2024-04-20'),
            rancangBangun: 'Platform pembelajaran digital dengan fitur kelas online, bank soal, dan evaluasi otomatis.',
            tujuanInovasi: 'Memperluas akses pendidikan berkualitas dan memudahkan evaluasi belajar.',
            manfaatInovasi: 'Guru lebih mudah memantau siswa, akses pendidikan merata.',
            hasilInovasi: 'Partisipasi siswa meningkat 20%, rata-rata nilai naik 15%.'
        },
        {
            namaInovasi: 'E-Parking System',
            inovator: 'Dinas Perhubungan',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi & Sensor',
            tanggalUjiCoba: new Date('2024-02-10'),
            tanggalPenerapan: new Date('2024-05-05'),
            rancangBangun: 'Sistem parkir pintar berbasis aplikasi dengan pembayaran non-tunai dan sensor ketersediaan lahan.',
            tujuanInovasi: 'Mengurangi kemacetan akibat pencarian parkir dan meningkatkan PAD dari sektor parkir.',
            manfaatInovasi: 'Parkir lebih efisien, transparansi pendapatan meningkat.',
            hasilInovasi: 'Waktu mencari parkir berkurang 40%, pendapatan daerah dari parkir naik 25%.'
        },
        {
            namaInovasi: 'Smart Tourism Guide',
            inovator: 'Dinas Pariwisata',
            jenisInovasi: 'DIGITAL',
            bentukInovasi: 'Aplikasi Mobile',
            tanggalUjiCoba: new Date('2024-03-15'),
            tanggalPenerapan: new Date('2024-07-10'),
            rancangBangun: 'Aplikasi panduan wisata berbasis AR (Augmented Reality) dengan integrasi peta dan informasi budaya lokal.',
            tujuanInovasi: 'Meningkatkan pengalaman wisatawan dan promosi pariwisata daerah.',
            manfaatInovasi: 'Wisatawan lebih mudah menemukan informasi, ekonomi kreatif daerah berkembang.',
            hasilInovasi: 'Jumlah kunjungan wisata naik 30%, lama tinggal wisatawan meningkat 20%.'
        }
    ];

    console.log('📋 Creating profil inovasi data...');

    // Create profil inovasi for each data
    for (let i = 0; i < profilInovasiData.length; i++) {
        const data = profilInovasiData[i];
        const userIndex = i % users.length; // Distribute among available users
        const selectedUser = users[userIndex];

        if (data && selectedUser) {
            await prisma.profilInovasi.create({
                data: {
                    namaInovasi: data.namaInovasi,
                    inovator: data.inovator,
                    jenisInovasi: data.jenisInovasi as JenisInovasi,
                    bentukInovasi: data.bentukInovasi,
                    tanggalUjiCoba: data.tanggalUjiCoba,
                    tanggalPenerapan: data.tanggalPenerapan,
                    rancangBangun: data.rancangBangun,
                    tujuanInovasi: data.tujuanInovasi,
                    manfaatInovasi: data.manfaatInovasi,
                    hasilInovasi: data.hasilInovasi,
                    userId: selectedUser.id
                }
            });

            console.log(`   ✅ ${i + 1}. ${data.namaInovasi} - ${data.jenisInovasi}`);
        }
    }

    console.log('');
    console.log('✅ Profil inovasi seed completed successfully!');
    console.log(`📊 Total data created: ${profilInovasiData.length} profil inovasi`);
    console.log(`👥 Distributed among ${users.length} OPD users`);
}

main()
    .catch((e) => {
        console.error('❌ Error during profil inovasi seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
