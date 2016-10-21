


export const STATUS_KENDARAAN = [
  {id: '0', desc: 'BELUM ADA INFO' },
  {id: '1', desc: 'KENDARAAN PENYEBAB'},
  {id: '2', desc: 'KENDARAAN TERLIBAT'},
  {id: '3', desc: 'NON KENDARAAN'},
];

export const STATUS_LAKA = [
  {id: 'Y', desc :'Laporan Kepolisian' },
  {id: 'N', desc :'Data Mutasi'},
];

export const JENIS_KENDARAAN = [
{id: 'A1', desc: 'SEPEDA MOTOR < 50 CC'},
{id: 'A2', desc: 'MOBIL AMBULANCE'},
{id: 'A3', desc: 'MOBIL JENAZAH'},
{id: 'A4', desc: 'PEMADAM KEBAKARAN'},
{id: 'B1', desc: 'TRAKTOR'},
{id: 'B2', desc: 'BULDOZER'},
{id: 'B3', desc: 'FORKLIFT'},
{id: 'B4', desc: 'MOBIL DEREK'},
{id: 'B5', desc: 'EXCAVATOR'},
{id: 'B6', desc: 'CRANE'},
{id: 'C1', desc: 'SEPEDA MOTOR < 250 CC'},
{id: 'C2', desc: 'SEPEDA KUMBANG / SCOOTER'},
{id: 'C3', desc: 'KENDARAAN BERMOTOR RODA 3'},
{id: 'C4', desc: 'SEPEDA MOTOR > 250 CC'},
{id: 'D1', desc: 'PICK UP/MBL BRG s/d 2400 CC'},
{id: 'D2', desc: 'SEDAN'},
{id: 'D3', desc: 'JEEP'},
{id: 'D4', desc: 'MBL PMP BUKAN ANGK. UMUM'},
{id: 'D5', desc: 'MBL PMP ANGK. UM s/d 1600 CC'},
{id: 'E1', desc: 'BUS BUKAN ANGKUTAN UMUM'},
{id: 'E2', desc: 'MIKROBUS BUKAN ANGK UMUM'},
{id: 'E3', desc: 'BUS ANGKUTAN UMUM'},
{id: 'E4', desc: 'MIKROBUS ANGKUTAN UMUM'},
{id: 'E5', desc: 'MBL PMP ANGK UM > 1600 CC'},
{id: 'E6', desc: 'MOBIL PENUMPANG UMUM > 8 SEAT'},
{id: 'F1', desc: 'TRUK'},
{id: 'F2', desc: 'MOBIL TANGKI'},
{id: 'F3', desc: 'GANDENGAN'},
{id: 'F4', desc: 'MOBIL BARANG > 2400 CC'},
{id: 'F5', desc: 'TRUK CONTAINER & SEJENISNYA'},
{id: 'G1', desc: 'KERETA API'},
{id: 'G2', desc: 'KERETA API > 50 KM'},
{id: 'KL', desc: 'KAPAL LAUT/SUNGAI/FERRY'},
{id: 'P', desc: 'PESAWAT UDARA'},
{id: 'P1', desc: 'PESAWAT UDARA'},
];

export const MERK_KENDARAAN = [
{id: '010000', desc: '010000 - Toyota'},
{id: '010101', desc: '010101 - Honda'},
{id: '010201', desc: '010201 - Yamaha'},
{id: '010301', desc: '010301 - Mitsubitshi'},
{id: '010401', desc: '010401 - Suzuki'},
{id: '010501', desc: '010501 - Mazda'},
{id: '010601', desc: '010601 - Nissan'},
{id: '010701', desc: '010701 - Daihatsu'},
{id: '010801', desc: '010801 - BMW'},
{id: '010901', desc: '010901 - Mercedes'},
{id: '011001', desc: '011001 - Chevrolet'},
{id: '011101', desc: '011101 - Peugeot'},
{id: '011201', desc: '011201 - Audi'},
{id: '011301', desc: '011301 - Isuzu'},
{id: '011401', desc: '011401 - Hyundai'},
{id: '011501', desc: '011501 - Kawasaki'},
{id: '011601', desc: '011601 - Scooter'},
{id: '011701', desc: '011701 - Volks Wagen'},

];

export const JENIS_SIM = [
{id:'A', desc:'SIM A'},
{id:'ABRI', desc:'ABRI'},
{id:'B1', desc:'SIM B1'},
{id:'B2', desc:'SIM B2'},
{id:'C', desc:'SIM C'},
];

export const JENIS_IDENTITAS = [
  {id:'KTP', desc:'KTP'},
  {id:'SIM', desc:'SIM'},
  {id:'NPWP', desc:'NPWP'},
  {id:'Passport', desc:'Passport'},

];


export const JENIS_KELAMIN = [
  {id:'L', desc:'Pria'},
  {id:'P', desc:'Wanita'},

];

export const JENIS_PEKERJAAN = [
  {id:'07', desc:'ABRI'},
  {id:'08', desc:'BURUH'},
  {id:'21', desc:'DOKTER'},
  {id:'23', desc:'GELANDANGAN'},
  {id:'16', desc:'IBU RUMAH TANGGA'},
  {id:'14', desc:'KRU ALAT ANGKUTAN'},
  {id:'99', desc:'LAIN-LAIN'},
  {id:'11', desc:'NELAYAN'},
  {id:'09', desc:'PEDAGANG'},
  {id:'22', desc:'PELAUT'},
  {id:'15', desc:'PENGEMUDI KEND. NON UMUM'},
  {id:'13', desc:'PENGEMUDI KENDARAAN UMUM'},
  {id:'19', desc:'PENSIUNAN PEGAWAI PEMERINTAH'},
  {id:'17', desc:'PENSIUNAN PURNAWIRAWAN ABRI'},
  {id:'10', desc:'PETANI'},
  {id:'12', desc:'PILOT / NAHKODA / MASINIS'},
  {id:'20', desc:'POLRI'},
  {id:'18', desc:'TURUT ORANG TUA'},
  {id:'06', desc:'WIRASWASTA'},
];

export const JENIS_STATUS_NIKAH = [
  {id:'B', desc:'Belum Kawin'},
  {id:'N', desc:'Kawin'},
  {id:'J', desc:'Janda'},
  {id:'D', desc:'Duda'},
];

export const JENIS_SIFAT_CEDERA = [
  {id:'01', desc:'MENINGGAL'},
  {id:'02', desc:'LUKA-LUKA'},
  {id:'05', desc:'MENINGGAL & LUKA-LUKA'},
  {id:'06', desc:'LUKA-LUKA & CACAT TETAP'},
];

export const JENIS_STATUS_KORBAN = [
  {id:'01', desc:'PENUMPANG'},
  {id:'03', desc:'PILOT/NAHKODA KAPAL'},
  {id:'04', desc:'PENGEMUDI KEND. NON BERMOTOR'},
  {id:'05', desc:'KERNET/KRU KENDARAAN'},
  {id:'06', desc:'ANAK BUAH KAPAL'},
  {id:'07', desc:'KRU PESAWAT UDARA'},
  {id:'08', desc:'PEMBONCENG'},
  {id:'09', desc:'PEJALAN KAKI/SEJENISNYA'},
  {id:'10', desc:'MASINIS / KRU KERETA API'},
  {id:'11', desc:'PENGENDARA RANMOR RODA 2'},
  {id:'12', desc:'PENGENDARA RANMOR RODA 3'},
  {id:'13', desc:'PENGENDARA RANMOR RODA 4'},
];

export const JENIS_STATUS_PERTANGGUNGAN = [
{id:'111', desc:'KBU BUS'},
{id:'112', desc:'KBU NON BUS'},
{id:'121', desc:'KERETA API'},
{id:'131', desc:'KAPAL LAUT'},
{id:'132', desc:'KAPAL SUNGAI / FERRY'},
{id:'141', desc:'PESAWAT UDARA'},
{id:'211', desc:'K.B. SIPIL'},
{id:'212', desc:'K.B. TNI/POLRI'},
{id:'213', desc:'K.R. API'},
];

export const JENIS_KESIMPULAN = [
  {id:1, desc: "Korban dapat dibayarkan"},
  {id:2, desc: "Korban tidak dapat dibayarkan"},
  {id:3, desc: "Korban belum ditangani kepolisian"},
  {id:4, desc: "Korban tidak bersedia melapor polisi"},
  {id:5, desc: "Kejadian Kecelakaan terjadi di Wilayah Kantor Lain"},
  {id:6, desc: "Bukan Korban Kecelakaan"},
];

export const JENIS_DOKUMEN = [
  {id:'01', desc: 'FORMULIR K'},
  {id:'02', desc: 'LAPORAN POLISI'},
  {id:'03', desc: 'SKET GAMBAR'},
  {id:'04', desc: 'STNK PENABRAK'},
  {id:'05', desc: 'STNK KORBAN'},
  {id:'06', desc: 'K.T.P'},
  {id:'07', desc: 'S.I.M'},
  {id:'08', desc: 'PASPOR'},
  {id:'09', desc: 'KARTU KELUARGA KORBAN'},
  {id:'10', desc: 'AKTE LAHIR'},
  {id:'11', desc: 'SURAT NIKAH'},
  {id:'12', desc: 'KUITANSI ASLI DARI RS'},
  {id:'13', desc: 'SURAT KEMATIAN'},
  {id:'14', desc: 'SURAT RUJUKAN'},
  {id:'15', desc: 'SURAT KUASA'},
  {id:'16', desc: 'FOTO RONTGEN'},
  {id:'17', desc: 'KET. PAMONG PRAJA'},
  {id:'18', desc: 'SURAT PERNYATAAN'},
  {id:'19', desc: 'SURAT KETERANGAN CACAT'},
  {id:'20', desc: 'LUNAS IW / EC / ANEKA'},
  {id:'21', desc: 'FORMULIR PENGAJUAN SANTUNAN'},
  {id:'22', desc: 'SURAT KETERANGAN KESEHATAN KORBAN'},
  {id:'23', desc: 'SURAT KETERANGAN AHLI WARIS'},
  {id:'24', desc: 'KETERANGAN SINGKAT KEJADIAN KECELAKAAN'},
  {id:'25', desc: 'LAPORAN SURVEY'},
  {id:'26', desc: 'SURAT PEMAKAMAN / KREMASI'},
  {id:'27', desc: 'SURAT PERMOHONAN EX GRATIA'},
  {id:'28', desc: 'KARTU KELUARGA PEMOHON'},
  {id:'30', desc: 'BERITA ACARA RESTITUSI KLAIM'},
  {id:'31', desc: 'SURAT/NOTA KOREKSI PEMBAYARAN KLAIM'},
  {id:'32', desc: 'TEMBUSAN KUITANSI RESTITUSI KLAIM'},
  {id:'61', desc: 'SURAT JAMINAN KE RUMAH SAKIT'},
  {id:'62', desc: 'FOTO KORBAN'},
];


export const JENIS_STATUS_JAMINAN_FOR_OTORISATOR = [
  {id:'ALL', desc: "Semua"},
  {id:'0', desc: "Belum Baca"},
  {id:'F0', desc: "Belum Survey"},
  {id:'F1', desc: "Sudah Survey"},
  {id:'1', desc: "Sudah Otorisasi"},
];

export const JENIS_STATUS_JAMINAN_FOR_SURVEYOR = [
  {id:'ALL', desc: "Semua"},
  {id:'F0', desc: "Belum Survey"},
  {id:'F1', desc: "Sudah Survey"},
  {id:'1', desc: "Sudah Otorisasi"},
];


export const SIFAT_KECELAKAAN = [
  {id: 'NR', desc: 'Normal'},
  {id: 'TL', desc: 'Tabrak Lari'},
];

export const SUMBER_DATA_LAKA = [
  {id: 'n', desc: 'DASI'},
  {id: 'y', desc: 'IRSMS'},
];

export const STATUS_JAMINAN_DETAIL = [
  {id:'0', desc: "Belum Baca"},
  {id:'F0', desc: "Belum Survey"},
  {id:'F1', desc: "Sudah Survey"},
  {id:1, desc: "Korban dapat dibayarkan"},
  {id:2, desc: "Korban tidak dapat dibayarkan"},
  {id:3, desc: "Korban belum ditangani kepolisian"},
  {id:4, desc: "Korban tidak bersedia melapor polisi"},
  {id:5, desc: "Kejadian Kecelakaan terjadi di Wilayah Kantor Lain"},
  {id:6, desc: "Bukan Korban Kecelakaan"},
];
