const fs = require('fs');
const indexCode = fs.readFileSync('C:/laragon/www/talaqee/resources/js/pages/Videos/Index.tsx', 'utf8');
const showCode = fs.readFileSync('C:/laragon/www/talaqee/resources/js/pages/Videos/Show.tsx', 'utf8');

// Extract mobile view from Show.tsx
const mobileMatch = showCode.match(/\{\/\*\s*─── MOBILE ───\s*\*\/\}([\s\S]*?)\{\/\*\s*─── DESKTOP ───\s*\*\/\}/);
const mobileView = mobileMatch ? mobileMatch[1] : '';

// Also extract dummyList from Show.tsx
const dummyListMatch = showCode.match(/const dummyList = \[([\s\S]*?)\];/);
const dummyList = dummyListMatch ? dummyListMatch[0] : 'const dummyList = [];';

// Update Index.tsx
let newIndexCode = indexCode.replace(/<div className="min-h-screen bg-gray-50/g, '<>\n            {/* ─── MOBILE ─── */}\n' + mobileView + '\n            {/* ─── DESKTOP ─── */}\n            <div className="hidden md:block min-h-screen bg-gray-50');

// Fix closing tag for desktop
newIndexCode = newIndexCode.replace(/<\/div>\s*\);\s*\}/, '</div>\n        </>\n    );\n}');

// Add imports
newIndexCode = newIndexCode.replace(/import \{ \n    Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,\n    Quote, ChevronDown, ArrowRight, Star\n\} from 'lucide-react';/, `import {\n    ArrowLeft, Bookmark, Share2, Play, Pause, Maximize2,\n    ThumbsUp, Download, List, Share, Eye, Calendar, User,\n    MoreVertical, ChevronDown, ChevronUp, Home, LayoutGrid,\n    PlaySquare, CircleUserRound, Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,\n    Quote, ArrowRight, Star\n} from 'lucide-react';`);

// Add state and dummy lists inside component
newIndexCode = newIndexCode.replace(/const \[selectedCategory, setSelectedCategory\] = useState<string>\('semua'\);/, `const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(26);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    ${dummyList}

    const currentVideo = recentVideos[0] || {
        id: 1,
        title: 'Menjaga Hati Agar Tetap Tenang',
        description: 'Hati yang tenang adalah kunci hidup bahagia. Dalam kajian ini, kita akan membahas bagaimana cara menjaga hati dari kegelisahan dan bagaimana cara untuk selalu bersyukur kepada Allah SWT.',
        thumbnail_url: '/images/katalog/video1.png',
        video_url: '',
        duration: 1935,
        total_views: 12500,
        created_at: '2024-05-12T00:00:00Z',
        author: { id: 1, name: 'Ust. Hanan Attaki, Lc' },
        category: { id: 1, name: 'Kajian', slug: 'kajian' },
    };
`);

// Add formatDate
newIndexCode = newIndexCode.replace(/const getCategoryIcon = /, `const formatDate = (dateString: string) => {
        if (!dateString) return '12 Mei 2024';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getCategoryIcon = `);

fs.writeFileSync('C:/laragon/www/talaqee/resources/js/pages/Videos/Index.tsx', newIndexCode);
console.log('Done');
