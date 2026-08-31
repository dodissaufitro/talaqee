const fs = require('fs');
const glob = require('glob');
const files = glob.sync('C:/laragon/www/talaqee/resources/js/pages/**/*.tsx');

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;

    // Check if the file has the bottom nav item for 'akun'
    if (content.includes("id: 'akun', label: 'Akun', icon: CircleUserRound, route: '/akun'") || 
        content.includes("id: 'akun', label: 'Akun', icon: CircleUserRound, active: true, route: '/akun'")) {
        
        // Ensure it has auth?.user check instead of hardcoded '/akun'
        content = content.replace(/\{ id: 'akun', label: 'Akun', icon: CircleUserRound, route: '\/akun' \}/g, "{ id: 'akun', label: 'Akun', icon: CircleUserRound, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }");
        
        content = content.replace(/\{ id: 'akun', label: 'Akun', icon: CircleUserRound, active: true, route: '\/akun' \}/g, "{ id: 'akun', label: 'Akun', icon: CircleUserRound, active: true, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }");

        if (content !== original) {
            fs.writeFileSync(f, content);
            console.log('Updated ' + f);
        }
    }
});
console.log('Done');
