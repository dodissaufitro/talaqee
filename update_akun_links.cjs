const fs = require('fs');
const glob = require('glob');
const files = glob.sync('C:/laragon/www/talaqee/resources/js/pages/**/*.tsx');
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    content = content.replace(/\{ id: 'akun', label: 'Akun', icon: CircleUserRound, route: '#' \}/g, "{ id: 'akun', label: 'Akun', icon: CircleUserRound, route: '/akun' }");
    if (content !== original) {
        fs.writeFileSync(f, content);
    }
});
console.log('Done replacing');
