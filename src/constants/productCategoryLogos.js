// Product category to logo mappings
export const productCategoryLogos = {
  // Games
  // apex
  'apex-legends': '/logos/apex-legend.png',
  'apex legend': '/logos/apex-legend.png',
  'apex': '/logos/apex-legend.png',
  
  // cod
  'call-of-duty': '/logos/call-of-duty-skull.png',
  'cod': '/logos/call-of-duty-skull.png',
  'callofduty': '/logos/call-of-duty-skull.png',
  
  // cs
  'counter-strike': '/logos/counter-strike-2.png',
  'cs2': '/logos/counter-strike-2.png',
  'csgo': '/logos/counter-strike-2.png',
  'counter strike': '/logos/counter-strike-2.png',
  
  // fn
  'fortnite': '/logos/fortnite.png',
  
  // gta
  'gta-v': '/logos/gta-v.png',
  'gta5': '/logos/gta-v.png',
  'grand theft auto': '/logos/gta-v.png',
  
  // overwatch
  'overwatch': '/logos/overwatch.png',
  
  // pokemon
  'pokemon-go': '/logos/pokemon-go.png',
  'pokemon': '/logos/pokemon-go.png',
  
  // rainbow6
  'rainbow-six': '/logos/rainbow-six-siege.png',
  'rainbow six': '/logos/rainbow-six-siege.png',
  'r6': '/logos/rainbow-six-siege.png',
  
  // roblox
  'roblox': '/logos/roblox.png',
  
  // rocket-league
  'rocket-league': '/logos/rocket-league.png',
  'rocket league': '/logos/rocket-league.png',
  
  // osrs
  'runescape': '/logos/rs-old-school.png',
  'old-school': '/logos/rs-old-school.png',
  'osrs': '/logos/rs-old-school.png',
  
  // valo
  'valorant': '/logos/valorant.png',
  
  // wow
  'world-of-warcraft': '/logos/world-of-warcraft.png',
  'wow': '/logos/world-of-warcraft.png',
  
  // Services/Platforms
  'apple': '/logos/apple-logo.png',
  'ios': '/logos/apple-logo.png',
  'iphone': '/logos/apple-logo.png',
  
  'discord': '/logos/discord.png',
  
  'playstation': '/logos/psn.png',
  'psn': '/logos/psn.png',
  'ps4': '/logos/psn.png',
  'ps5': '/logos/psn.png',
  
  'spotify': '/logos/spotify.png',
  
  'steam': '/logos/steam.png',
  
  'xbox': '/logos/xbox.png',
  
  'razer': '/logos/razer.png',
  
  'crunchyroll': '/logos/crunchyroll_Logo.png',
  'anime': '/logos/crunchyroll_Logo.png',
  
  // Gaming services
  'fc-26': '/logos/fc-26.png',
  'fc26': '/logos/fc-26.png',
  'ea-fc': '/logos/fc-26.png',
  'fifa': '/logos/fc-26.png',
  
  // Generic fallbacks
  'gaming': '/logos/steam.png',
  'game': '/logos/steam.png',
  'digital': '/logos/steam.png',
  'service': '/logos/steam.png',
};

// Helper function to get logo for a product category
export function getProductCategoryLogo(categoryName) {
  if (!categoryName) return null;
  
  const name = categoryName.toLowerCase().trim();
  
  // Direct match
  if (productCategoryLogos[name]) {
    return productCategoryLogos[name];
  }
  
  // Try with spaces replaced by hyphens
  const withHyphens = name.replace(/\s+/g, '-');
  if (productCategoryLogos[withHyphens]) {
    return productCategoryLogos[withHyphens];
  }
  
  // Try without hyphens
  const noHyphens = name.replace(/-/g, '');
  if (productCategoryLogos[noHyphens]) {
    return productCategoryLogos[noHyphens];
  }
  
  // Partial match - check if any key is contained in the name
  for (const [key, value] of Object.entries(productCategoryLogos)) {
    const cleanKey = key.replace(/-/g, '');
    const cleanName = name.replace(/-/g, '').replace(/\s+/g, '');
    
    if (cleanName.includes(cleanKey) || cleanKey.includes(cleanName)) {
      return value;
    }
  }
  
  // Default fallback
  return '/logos/steam.png';
}

// Get all available logos for the "+4" section
export function getAdditionalLogos(count = 4) {
  const allLogos = Object.values(productCategoryLogos);
  // Remove duplicates and return first 'count' logos
  const uniqueLogos = [...new Set(allLogos)];
  return uniqueLogos.slice(0, count);
}
