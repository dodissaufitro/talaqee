<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Surah;
use App\Models\Ayah;

class QuranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Fetching Quran data from API...');
        
        $response = Http::get('http://api.alquran.cloud/v1/quran/quran-uthmani');
        
        if ($response->successful()) {
            $data = $response->json()['data'];
            $surahs = $data['surahs'];
            
            foreach ($surahs as $surahData) {
                $surah = Surah::updateOrCreate(
                    ['number' => $surahData['number']],
                    [
                        'name' => $surahData['name'],
                        'english_name' => $surahData['englishName'],
                        'english_name_translation' => $surahData['englishNameTranslation'],
                        'number_of_ayahs' => count($surahData['ayahs']),
                        'revelation_type' => $surahData['revelationType'],
                    ]
                );
                
                $ayahsToInsert = [];
                foreach ($surahData['ayahs'] as $ayahData) {
                    $ayahsToInsert[] = [
                        'surah_id' => $surah->id,
                        'number' => $ayahData['number'],
                        'number_in_surah' => $ayahData['numberInSurah'],
                        'text' => $ayahData['text'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                
                // Chunk insert to avoid memory issues if needed, but 286 (Baqarah) is fine.
                Ayah::insert($ayahsToInsert);
                $this->command->info("Seeded Surah: {$surah->name}");
            }
            $this->command->info('Quran Seeder Completed Successfully!');
        } else {
            $this->command->error('Failed to fetch data from Alquran API.');
        }
    }
}
