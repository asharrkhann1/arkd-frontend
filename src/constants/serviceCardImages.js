// Mapping of service category slugs to their card images
export const serviceCardImages = {
    // Accounts service categories
    'clash-royale': '/service-cards/clash-royal.png',
    'clash-royal': '/service-cards/clash-royal.png',
    'fc-26': '/service-cards/fc-26.png',
    'fc26': '/service-cards/fc-26.png',
    'fortnite': '/service-cards/fortnite.png',
    'marvel-rivals': '/service-cards/marvel-rivals.png',
    'marvelrivals': '/service-cards/marvel-rivals.png',
    'rocket-league': '/service-cards/rocket-league.png',
    'rocketleague': '/service-cards/rocket-league.png',
    'rainbow-six': '/service-cards/tom-clancys-rainbow-six.png',
    'rainbowsix': '/service-cards/tom-clancys-rainbow-six.png',
    'tom-clancys-rainbow-six': '/service-cards/tom-clancys-rainbow-six.png',
    'valorant': '/service-cards/valorant.png',
    'wow': '/service-cards/wow1.png',
    'world-of-warcraft': '/service-cards/wow1.png',
    'worldofwarcraft': '/service-cards/wow1.png',
    // Currency categories
    'fifa': '/service-cards/fc-26.png',
    'lol': '/service-cards/pngwing-1.png',
    'league-of-legends': '/service-cards/pngwing-1.png',
    'pubg': '/service-cards/pngwing-2.png',
    // Generic fallbacks
    'pngwing-1': '/service-cards/pngwing-1.png',
    'pngwing-2': '/service-cards/pngwing.com (2).png',
    'pngwing-3': '/service-cards/pngwing.com (3).png',
    'pngwing-4': '/service-cards/pngwing.com (4).png',
    'pngwing-5': '/service-cards/pngwing.com (5).png',
};

// Helper function to get image for a category with fuzzy matching
export function getServiceCardImage(categorySlug) {
    if (!categorySlug) return null;
    
    const slug = categorySlug.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    
    // Direct match
    if (serviceCardImages[slug]) {
        return serviceCardImages[slug];
    }
    
    // Try without hyphens
    const noHyphens = slug.replace(/-/g, '');
    if (serviceCardImages[noHyphens]) {
        return serviceCardImages[noHyphens];
    }
    
    // Partial match - check if any key is contained in the slug
    for (const [key, value] of Object.entries(serviceCardImages)) {
        if (slug.includes(key.replace(/-/g, '')) || key.replace(/-/g, '').includes(slug)) {
            return value;
        }
    }
    
    return null;
}
