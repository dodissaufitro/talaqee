const fs = require('fs');

// Fix Audios/Index.tsx
let f1 = 'C:/laragon/www/talaqee/resources/js/pages/Audios/Index.tsx';
let c1 = fs.readFileSync(f1, 'utf8');
// Deduplicate imports
c1 = c1.replace(/import { \n    Headphones, \n    Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,\n    Quote, ChevronDown, ArrowRight, Star, Play, MoreVertical, Download,\n    SkipBack, SkipForward, Repeat, Shuffle, Volume2, ChevronUp, ArrowLeft, Bookmark, Heart, Share2, ListPlus, RotateCcw, RotateCw, Moon, LayoutGrid, CircleUserRound, Calendar\n} from 'lucide-react';/,
`import { 
    Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ChevronDown, ArrowRight, Star, Play, MoreVertical, Download,
    SkipBack, SkipForward, Repeat, Shuffle, Volume2, ChevronUp, ArrowLeft, 
    Bookmark, Share2, ListPlus, RotateCcw, RotateCw, Moon, LayoutGrid, CircleUserRound, Calendar, Headphones, Pause, ChevronRight, Home
} from 'lucide-react';`);
fs.writeFileSync(f1, c1);

// Fix Videos/Index.tsx
let f2 = 'C:/laragon/www/talaqee/resources/js/pages/Videos/Index.tsx';
let c2 = fs.readFileSync(f2, 'utf8');
if (!c2.includes('Headphones,')) {
    c2 = c2.replace(/import {/, 'import { Headphones,');
    fs.writeFileSync(f2, c2);
}

// Fix Videos/Show.tsx
let f3 = 'C:/laragon/www/talaqee/resources/js/pages/Videos/Show.tsx';
let c3 = fs.readFileSync(f3, 'utf8');
if (!c3.includes('Headphones,')) {
    c3 = c3.replace(/import {/, 'import { Headphones,');
    fs.writeFileSync(f3, c3);
}

console.log('Fixed imports');
