const fs = require('fs');
const glob = require('glob');

const files = glob.sync('C:/laragon/www/talaqee/resources/js/pages/**/*.tsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the Koin item in the array
    if (content.includes("{ id: 'koin', label: 'Koin', icon: 'coin', route: '#' }")) {
        content = content.replace(
            "{ id: 'koin', label: 'Koin', icon: 'coin', route: '#' }",
            "{ id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' }"
        );
        // Also ensure Headphones is imported from lucide-react
        if (!content.includes('Headphones')) {
            content = content.replace(/import\s*\{\s*([\s\S]*?)\s*\}\s*from\s*'lucide-react';/, (match, p1) => {
                return `import { \n    Headphones, ${p1}\n} from 'lucide-react';`;
            });
        }
        
        // Remove the custom 'coin' icon render block
        content = content.replace(
            /\{item\.icon === 'coin' \? \([\s\S]*?\) : \([\s\S]*?<item\.icon className="w-6 h-6 text-\[#94A3B8\] stroke-\[1\.5\]" \/>\s*\n\s*\)\}/,
            '<item.icon className="w-6 h-6 text-[#94A3B8] stroke-[1.5]" />'
        );
        
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
