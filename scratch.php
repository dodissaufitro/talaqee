<?php
$data = json_decode(file_get_contents('https://equran.id/api/v2/surat/1'), true);
echo json_encode($data['data']['ayat'][0], JSON_PRETTY_PRINT);
