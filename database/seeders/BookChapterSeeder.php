<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\BookChapter;

class BookChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = Book::all();

        if ($books->isEmpty()) {
            $this->command->info('Tidak ada buku yang ditemukan.');
            return;
        }

        $chapterTemplates = [
            1 => [
                'title' => 'Bab 1: Pendahuluan & Awal Mula',
                'description' => 'Membuka lembaran pertama, mengenalkan latar belakang, suasana, dan titik tolak kisah ini dimulai.',
                'content' => "Setiap perjalanan besar selalu bermula dari langkah yang tampak sunyi dan sederhana. Di halaman-halaman awal ini, kita diajak untuk melihat lebih dalam tentang apa yang melatarbelakangi kisah ini.\n\nWaktu berjalan perlahan, namun aroma perubahan sudah mulai tercium di udara. Mereka yang hadir saat itu belum menyadari bahwa hari-hari berikutnya akan menuntut lebih dari sekadar keberanian biasa.\n\nPertemuan demi pertemuan mulai merajut ikatan yang tak mudah putus. Dari bisik-bisik kecil hingga rencana yang digariskan di bawah temaram lampu, semua menyatu menjadi sebuah harmoni perjuangan.",
                'page_count' => 14,
                'is_free' => true,
                'coin_price' => 0,
            ],
            2 => [
                'title' => 'Bab 2: Jejak dan Bayangan',
                'description' => 'Mengikuti jejak peristiwa yang membawa para tokoh ke dalam intrik dan dinamika yang lebih dalam.',
                'content' => "Langkah kaki semakin jauh meninggalkan zona nyaman. Di balik bayang-bayang kepastian, mulai muncul tanda-tanda yang menguji keyakinan.\n\nTak ada jalan pintas dalam mencari kebenaran. Setiap fakta yang terungkap membawa serta tanya yang lebih besar daripada jawaban yang diberikan.\n\n\"Apakah kita benar-benar siap untuk menghadapi apa yang ada di depan?\" sebuah pertanyaan melayang di antara keheningan malam, tanpa ada yang berani menjawab dengan lantang.",
                'page_count' => 18,
                'is_free' => true,
                'coin_price' => 0,
            ],
            3 => [
                'title' => 'Bab 3: Riak Gelombang Kehidupan',
                'description' => 'Konflik mulai mencuat ke permukaan dan mempengaruhi keputusan-keputusan krusial.',
                'content' => "Ketenangan air di permukaan sering kali menyembunyikan arus deras yang bergolak di kedalaman. Babak baru ini membawa goncangan yang tak terduga.\n\nKeputusan yang diambil terburu-buru mulai menuntut konsekuensi. Di tengah ketidakpastian itu, komitmen dan kejujuran diuji pada titik tertingginya.\n\nBukan tentang siapa yang terkuat, melainkan siapa yang mampu bertahan saat angin bertiup kencang dari segala arah.",
                'page_count' => 20,
                'is_free' => false,
                'coin_price' => 10,
            ],
            4 => [
                'title' => 'Bab 4: Di Persimpangan Jalan',
                'description' => 'Menghadapi pilihan sulit yang akan menentukan masa depan dan jalan yang ditempuh.',
                'content' => "Berdiri di sebuah persimpangan adalah saat paling hening sekaligus menegangkan. Satu jalan menjanjikan kemudahan semu, sedangkan jalan lainnya terjal dan penuh liku.\n\nKata hati berbicara lebih keras daripada logika sesaat. Di sini, nilai-nilai yang selama ini dipelajari harus dipraktikkan secara nyata.\n\nDengan mantap, pilihan dijatuhkan, meski sadar bahwa tak ada lagi jalan untuk berbalik arah.",
                'page_count' => 16,
                'is_free' => false,
                'coin_price' => 10,
            ],
            5 => [
                'title' => 'Bab 5: Badai dan Ketabahan',
                'description' => 'Klimaks ketegangan pertama di mana tantangan terbesar datang menghadang.',
                'content' => "Langit gelap menggulung harapan, dan badai yang dikhawatirkan akhirnya tiba. Tak ada tempat untuk bersembunyi kecuali terus melangkah maju.\n\nSetiap hembusan angin dingin menyadarkan bahwa ketabahan adalah satu-satunya pelindung jiwa. Di sinilah persahabatan dan kebersamaan menjadi api penyemangat yang tak padam.\n\nWalau letih merayapi raga, semangat untuk sampai ke tujuan terus membara di dalam dada.",
                'page_count' => 22,
                'is_free' => false,
                'coin_price' => 10,
            ],
            6 => [
                'title' => 'Bab 6: Titik Balik yang Terang',
                'description' => 'Titik terang mulai tampak setelah melewati masa-masa paling kelam.',
                'content' => "Cahaya fajar perlahan menyapu kegelapan yang pekat. Dari puing-puing keputusasaan, lahir pemahaman baru tentang arti sebuah proses.\n\nApa yang semula dirasa sebagai kekalahan, ternyata menjadi batu loncatan yang tak ternilai harganya. Kebijaksanaan tumbuh dari luka yang telah sembuh.\n\nLangkah-langkah berikutnya diambil dengan lebih bijak, penuh kehati-hatian namun tanpa rasa takut.",
                'page_count' => 19,
                'is_free' => false,
                'coin_price' => 10,
            ],
            7 => [
                'title' => 'Bab 7: Membangun Kembali Harapan',
                'description' => 'Menata kembali rencana dan menyusun strategi baru untuk mencapai tujuan akhir.',
                'content' => "Dengan semangat yang telah teruji, fondasi baru mulai dibangun. Setiap bata pengalaman diletakkan dengan penuh perhitungan.\n\nKolaborasi dan saling melengkapi menjadi kunci utama. Tak ada lagi ego yang menghalangi terwujudnya cita-cita bersama.\n\nHarapan yang sempat redup kini menyala kembali, menerangi lorong panjang yang harus dilewati.",
                'page_count' => 21,
                'is_free' => false,
                'coin_price' => 10,
            ],
            8 => [
                'title' => 'Bab 8: Menembus Batas Kemampuan',
                'description' => 'Menantang keterbatasan diri dan membuka potensi terbaik yang selama ini terpendam.',
                'content' => "Batas sering kali hanya ilusi yang diciptakan oleh ketakutan kita sendiri. Saat batas itu didorong lebih jauh, terbentang ruang luas yang tak terhingga.\n\nKekuatan sejati bukanlah ketiadaan keraguan, melainkan tekad untuk terus berjalan meski keraguan itu ada.\n\nPrestasi demi prestasi kecil mulai diraih, memperkuat keyakinan bahwa tujuan besar semakin dekat untuk diraih.",
                'page_count' => 24,
                'is_free' => false,
                'coin_price' => 10,
            ],
            9 => [
                'title' => 'Bab 9: Puncak Pembuktian',
                'description' => 'Menjelang garis akhir, ujian penentu menguji seluruh buah perjalanan panjang.',
                'content' => "Semua persiapan, air mata, dan jerih payah bermuara pada momen ini. Saat di mana pembuktian tak lagi memerlukan banyak kata.\n\nFokus dan ketenangan menjadi pembeda antara keberhasilan dan penyesalan. Seluruh energi dicurahkan untuk memberikan yang terbaik.\n\nDan saat rintangan terakhir terlewati, kelegaan yang luar biasa menyelimuti seluruh jiwa dan raga.",
                'page_count' => 25,
                'is_free' => false,
                'coin_price' => 10,
            ],
            10 => [
                'title' => 'Bab 10: Garis Akhir & Lembaran Baru',
                'description' => 'Penutup yang memuaskan dan membuka pandangan baru tentang masa depan.',
                'content' => "Sebuah akhir hanyalah awal dari kisah berikutnya. Melihat ke belakang, setiap kilometer perjalanan memiliki hikmah dan keindahannya sendiri.\n\nBuku ini mungkin telah selesai di halaman ini, namun nilai dan inspirasi yang tertanam di dalamnya akan terus hidup dan bergema.\n\nSelamat atas perjalanan yang telah ditempuh, dan bersiaplah untuk membuka babak baru dalam hidup dengan pandangan yang lebih kaya.",
                'page_count' => 17,
                'is_free' => false,
                'coin_price' => 10,
            ],
        ];

        foreach ($books as $book) {
            for ($num = 1; $num <= 10; $num++) {
                $tpl = $chapterTemplates[$num];

                // Jika bab sudah ada, pertahankan judul kustom jika bukan judul default bab
                $existing = BookChapter::where('book_id', $book->id)
                    ->where('chapter_number', $num)
                    ->first();

                if ($existing) {
                    $existing->update([
                        'title' => !empty($existing->title) && !str_starts_with($existing->title, 'Bab ' . $num . ':') ? $existing->title : $tpl['title'],
                        'description' => $existing->description ?: $tpl['description'],
                        'content' => $existing->content ?: $tpl['content'],
                        'page_count' => $existing->page_count > 0 ? $existing->page_count : $tpl['page_count'],
                        'coin_price' => $tpl['coin_price'],
                        'is_free' => $tpl['is_free'],
                        'is_active' => true,
                    ]);
                } else {
                    BookChapter::create([
                        'book_id' => $book->id,
                        'chapter_number' => $num,
                        'title' => $tpl['title'],
                        'description' => $tpl['description'],
                        'content' => $tpl['content'],
                        'page_count' => $tpl['page_count'],
                        'coin_price' => $tpl['coin_price'],
                        'is_free' => $tpl['is_free'],
                        'is_active' => true,
                    ]);
                }
            }
        }

        $this->command->info('Berhasil menambahkan/memperbarui 10 bab untuk seluruh buku (' . $books->count() . ' buku).');
    }
}
