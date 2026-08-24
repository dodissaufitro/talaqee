const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('resources/js/pages/admin');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const searchString = "{ name: 'Bab Buku', icon: 'BookOpen', route: 'admin.chapters.index' },";
    if (content.includes(searchString)) {
        // Split by lines and remove the exact line containing the search string
        let lines = content.split('\n');
        lines = lines.filter(line => !line.includes(searchString));
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log('Fixed ' + file);
    }
});
