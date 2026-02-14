// Mapping of origins to their background images
export const originBackgrounds = {
    'valorant': '/pages-backgrounds/valorant-bg-1.png',
    'gtav': '/pages-backgrounds/gtav-bg-1.png',
    'gta': '/pages-backgrounds/gtav-bg-1.png',
    'fortnite': '/pages-backgrounds/fortnite-bg.jpg',
    'lol': '/pages-backgrounds/lol-bg.png',
    'league': '/pages-backgrounds/lol-bg.png',
    'osrs': '/pages-backgrounds/osrs-bg.png',
    'runescape': '/pages-backgrounds/osrs-bg.png',
    'roblox': '/pages-backgrounds/roblox-bg-2.png',
    'pokemon-go': '/pages-backgrounds/pokemon-go-bg-1.png',
    'pokemon': '/pages-backgrounds/pokemon-go-bg-1.png',
    'clash': '/pages-backgrounds/clash-bg-1.png',
    'clash-of-clans': '/pages-backgrounds/clash-bg-1.png',
    'call-of-duty': '/pages-backgrounds/code-bg-1.png',
    'cod': '/pages-backgrounds/code-bg-1.png',
    'fc': '/pages-backgrounds/fc-26-bg.png',
    'fifa': '/pages-backgrounds/fc-26-bg.png',
    'discord': '/pages-backgrounds/discord-bg-1.png',
    'crunchyroll': '/pages-backgrounds/crunchy-roll-bg-1.png',
};

// Get background image for a category/origin
export function getBackgroundForOrigin(origin) {
    if (!origin) return null;
    
    const normalized = origin.toLowerCase().replace(/\s+/g, '-').replace(/[_]/g, '-');
    
    // Try exact match first
    if (originBackgrounds[normalized]) {
        return originBackgrounds[normalized];
    }
    
    // Try partial matches
    for (const [key, bg] of Object.entries(originBackgrounds)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return bg;
        }
    }
    
    return null;
}

// Get random background from available options
export function getRandomBackground() {
    const backgrounds = Object.values(originBackgrounds);
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}
