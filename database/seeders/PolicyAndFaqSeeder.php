<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PolicyAndFaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Refund Policy Page
        \App\Models\Page::updateOrCreate(
            ['slug' => 'refund-policy'],
            [
                'title' => 'Kebijakan Pengembalian Dana (Refund Policy)',
                'content' => '
<h2>Kebijakan Pengembalian Dana Talaqee</h2>
<p>Terima kasih telah menggunakan aplikasi Talaqee. Kami berkomitmen untuk memberikan pengalaman membaca dan mendengarkan terbaik bagi Anda.</p>
<h3>1. Produk Digital</h3>
<p>Karena produk yang kami sediakan berupa produk digital (buku, audio, video, dan koin digital), semua pembelian bersifat <strong>final dan tidak dapat dikembalikan (non-refundable)</strong> setelah transaksi berhasil dilakukan dan konten telah diakses atau koin telah masuk ke akun Anda.</p>
<h3>2. Pengecualian Pengembalian Dana</h3>
<p>Pengembalian dana hanya dapat dipertimbangkan dalam kondisi berikut:</p>
<ul>
    <li>Terjadi kesalahan teknis pada sistem kami yang menyebabkan Anda terpotong saldo/pembayaran ganda untuk satu kali transaksi.</li>
    <li>Konten yang Anda beli rusak secara teknis dan tidak dapat diakses sama sekali (blank/error) dan tim teknis kami tidak dapat memperbaikinya dalam waktu 7x24 jam.</li>
</ul>
<h3>3. Proses Klaim</h3>
<p>Jika Anda memenuhi syarat pengecualian di atas, Anda dapat mengajukan permintaan pengembalian dana maksimal <strong>3 hari</strong> sejak tanggal transaksi. Hubungi tim dukungan kami melalui email dengan melampirkan bukti transaksi dan penjelasan kendala.</p>
<p><em>*Talaqee berhak menolak permintaan refund jika ditemukan adanya indikasi kecurangan atau penyalahgunaan.</em></p>
                '
            ]
        );

        // 2. Create FAQs
        $faqs = [
            [
                'question' => 'Apa itu aplikasi Talaqee?',
                'answer' => 'Talaqee adalah platform digital yang menyediakan ribuan buku, audio, dan video Islami berkualitas yang dapat Anda nikmati kapan saja dan di mana saja.',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana cara membeli buku atau bab (chapter) di aplikasi ini?',
                'answer' => 'Anda harus memiliki Saldo Koin terlebih dahulu. Setelah Anda mengisi koin (Top Up) melalui menu Dompet/Wallet, Anda dapat menggunakan koin tersebut untuk membuka bab atau membeli buku premium yang terkunci.',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah buku yang sudah dibeli bisa dibaca offline?',
                'answer' => 'Ya, beberapa buku dan konten digital yang telah Anda beli dan unduh (download) ke dalam perangkat Anda dapat diakses tanpa koneksi internet melalui menu Library / Pustaka.',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Mengapa saya tidak menerima koin setelah melakukan pembayaran (Top Up)?',
                'answer' => 'Proses verifikasi pembayaran biasanya memakan waktu beberapa menit. Jika koin belum masuk setelah 15 menit, silakan muat ulang (refresh) halaman aplikasi. Jika masih belum masuk, segera hubungi Customer Service kami dengan melampirkan bukti transfer.',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'question' => 'Apakah saldo koin saya bisa diuangkan kembali?',
                'answer' => 'Tidak. Saldo koin yang telah dibeli hanya dapat digunakan untuk transaksi di dalam aplikasi Talaqee dan tidak dapat diuangkan (refund) dengan alasan apapun.',
                'order' => 5,
                'is_active' => true,
            ]
        ];

        foreach ($faqs as $faq) {
            \App\Models\Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }
    }
}
