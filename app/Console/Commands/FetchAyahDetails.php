<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchAyahDetails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quran:fetch-details {surah?}';

    protected $description = 'Fetch transliteration and translation for ayahs from EQuran API';

    public function handle()
    {
        $surahArg = $this->argument('surah');
        
        $surahs = \App\Models\Surah::when($surahArg, function($q) use ($surahArg) {
            return $q->where('number', $surahArg);
        })->get();

        foreach ($surahs as $surah) {
            $this->info("Fetching details for Surah {$surah->number} ({$surah->name})...");
            $response = \Illuminate\Support\Facades\Http::get("https://equran.id/api/v2/surat/{$surah->number}");
            
            if ($response->successful()) {
                $ayatData = $response->json()['data']['ayat'];
                foreach ($ayatData as $ayat) {
                    \App\Models\Ayah::where('surah_id', $surah->id)
                        ->where('number_in_surah', $ayat['nomorAyat'])
                        ->update([
                            'transliteration' => $ayat['teksLatin'],
                            'translation' => $ayat['teksIndonesia'],
                        ]);
                }
                $this->info("Updated Surah {$surah->number}");
            } else {
                $this->error("Failed to fetch Surah {$surah->number}");
            }
        }
        
        $this->info('Done!');
    }
}
