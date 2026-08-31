const fs = require('fs');

const files = [
    "c:/laragon/www/talaqee/resources/js/pages/welcome.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Videos/Show.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Videos/Index.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Katalog/Index.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Book/Show.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Audios/Index.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Alquran/Show.tsx",
    "c:/laragon/www/talaqee/resources/js/pages/Akun/Index.tsx"
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        content = content.replace(
            /\{\s*id:\s*'rekaman',\s*label:\s*'Rekaman',\s*icon:\s*Headphones,\s*active:\s*true,\s*route:\s*'\/alquran'\s*\}/g,
            "{ id: 'rekaman', label: 'Rekaman', icon: Headphones, active: true, route: '/audios' }"
        );
        content = content.replace(
            /\{\s*id:\s*'rekaman',\s*label:\s*'Rekaman',\s*icon:\s*Headphones,\s*route:\s*'\/alquran'\s*\}/g,
            "{ id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' }"
        );
        
        fs.writeFileSync(file, content);
        console.log('Reverted ' + file);
    } catch(e) {
        console.error('Error with ' + file + ':', e.message);
    }
});
