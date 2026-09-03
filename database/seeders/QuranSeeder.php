<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Surah;
use App\Models\Ayah;
use Illuminate\Support\Facades\DB;

class QuranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Mengambil data list Surat dari API equran.id...');
        
        $response = Http::timeout(30)->get('https://equran.id/api/v2/surat');
        
        if ($response->successful()) {
            $surahs = $response->json()['data'];
            
            $overallAyahNumber = 1;
            
            // Nonaktifkan foreign key checks sementara jika diperlukan
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            
            // Kosongkan tabel jika ingin mulai dari awal
            Ayah::truncate();
            Surah::truncate();
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            $this->command->info('Memulai proses seeding Surat dan Ayat...');
            $bar = $this->command->getOutput()->createProgressBar(count($surahs));
            $bar->start();
            
            foreach ($surahs as $surahData) {
                // Buat Surat
                $surah = Surah::create([
                    'number' => $surahData['nomor'],
                    'name' => $surahData['nama'],
                    'english_name' => $surahData['namaLatin'],
                    'english_name_translation' => $surahData['arti'],
                    'number_of_ayahs' => $surahData['jumlahAyat'],
                    'revelation_type' => $surahData['tempatTurun'],
                ]);
                
                // Ambil detail ayat untuk surat ini
                $ayatResponse = Http::timeout(30)->get("https://equran.id/api/v2/surat/{$surahData['nomor']}");
                
                if ($ayatResponse->successful()) {
                    $ayatData = $ayatResponse->json()['data']['ayat'];
                    
                    $ayahsToInsert = [];
                    foreach ($ayatData as $ayah) {
                        $ayahsToInsert[] = [
                            'surah_id' => $surah->id,
                            'number' => $overallAyahNumber++,
                            'number_in_surah' => $ayah['nomorAyat'],
                            'text' => $ayah['teksArab'],
                            'translation' => $ayah['teksIndonesia'],
                            // Mengambil audio dari Misyari Rasyid Al-Afasi (key 05)
                            'audio_url' => $ayah['audio']['05'] ?? null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    
                    // Insert batch untuk ayat
                    // Pecah menjadi chunk jika terlalu besar, tapi rata-rata maks 286 (Baqarah) jadi aman insert sekaligus
                    Ayah::insert($ayahsToInsert);
                } else {
                    $this->command->error("\nGagal mengambil data ayat untuk Surat: {$surahData['namaLatin']}");
                }
                
                $bar->advance();
            }
            
            $bar->finish();
            $this->command->info("\nQuran Seeder (beserta Terjemahan dan Audio) Berhasil Dijalankan!");
        } else {
            $this->command->error('Gagal mengambil data dari API equran.id.');
        }
    }
}
