const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('resources/js/pages/admin/**/*.tsx');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('navItems = [') && !content.includes("name: 'Pengguna'")) {
        // We'll replace the Pengaturan item to insert Pengguna before it
        content = content.replace(
            /\{\s*name:\s*'Pengaturan',\s*icon:\s*'Settings',\s*route:\s*'admin\.settings\.index'\s*\}/g,
            "{ name: 'Pengguna', icon: 'UserCircle', route: 'admin.users.index' },\n        { name: 'Pengaturan', icon: 'Settings', route: 'admin.settings.index' }"
        );
        
        // Also import UserCircle if not present
        if (!content.includes('UserCircle') && content.includes('lucide-react')) {
            content = content.replace(/Settings,/g, 'Settings, UserCircle,');
        }

        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
console.log('Done');
