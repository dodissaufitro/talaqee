const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
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
    let changed = false;

    if (content.includes('navItems = [') && !content.includes("name: 'Ke Landing Page'")) {
        // Replace
        content = content.replace(
            /\{\s*name:\s*'Dashboard',\s*icon:\s*'LayoutDashboard',\s*route:\s*'admin\.dashboard'\s*\}/g,
            "{ name: 'Ke Landing Page', icon: 'Globe', route: 'home' },\n        { name: 'Dashboard', icon: 'LayoutDashboard', route: 'admin.dashboard' }"
        );
        changed = true;
        
        // Import
        if (!content.includes('Globe') && content.includes('lucide-react')) {
            content = content.replace(/LayoutDashboard,/g, 'LayoutDashboard, Globe,');
            // If LayoutDashboard wasn't explicitly imported but we need Globe, let's just append it.
            if (!content.includes('Globe,')) {
                 content = content.replace(/import \{/g, 'import { Globe,');
            }
        }
    }

    // Since we appended Globe to the top import if missing, let's make sure it's clean.
    // A cleaner way is to just add Globe to the import block.
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
console.log('Done');
