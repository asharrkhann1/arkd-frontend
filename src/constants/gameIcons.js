import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Flame, 
  Star, 
  Crown, 
  Gem, 
  Target, 
  Trophy,
  Flag,
  Rocket,
  Bomb,
  Crosshair,
  Gamepad2,
  Users,
  Coins,
  Package,
  Gift,
  CreditCard,
  Wallet
} from 'lucide-react';

/**
 * Game Icons Mapping
 * Maps game names to their corresponding icons
 */
export const gameIcons = {
  // Popular Games
  'valorant': Sword,
  'fifa': Trophy,
  'cod': Crosshair,
  'call of duty': Crosshair,
  'csgo': Target,
  'counter-strike': Target,
  'dota': Shield,
  'lol': Shield,
  'league of legends': Shield,
  'fortnite': Rocket,
  'minecraft': Gem,
  'gta': Flag,
  'grand theft auto': Flag,
  'apex': Flame,
  'apex legends': Flame,
  'overwatch': Star,
  'pubg': Crosshair,
  'free fire': Flame,
  'roblox': Gem,
  'among us': Users,
  'fall guys': Heart,
  'rocket league': Rocket,
  
  // Default fallback
  'default': Gamepad2
};

/**
 * Get icon component for a game name
 */
export function getGameIcon(gameName) {
  if (!gameName) return gameIcons.default;
  
  const normalizedName = gameName.toLowerCase().trim();
  return gameIcons[normalizedName] || gameIcons.default;
}

/**
 * Get color scheme for a game (can be extended)
 */
export const gameColors = {
  'valorant': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'from-red-500 to-orange-500' },
  'fifa': { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'from-green-500 to-emerald-500' },
  'cod': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'from-blue-500 to-cyan-500' },
  'csgo': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'from-orange-500 to-yellow-500' },
  'dota': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'from-purple-500 to-pink-500' },
  'lol': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'from-yellow-500 to-orange-500' },
  'fortnite': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'from-purple-500 to-indigo-500' },
  'minecraft': { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'from-green-500 to-emerald-500' },
  'gta': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'from-orange-500 to-red-500' },
  'apex': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'from-red-500 to-pink-500' },
  'overwatch': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'from-orange-500 to-yellow-500' },
  'pubg': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'from-yellow-500 to-orange-500' },
  'free fire': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'from-orange-500 to-red-500' },
  'roblox': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'from-blue-500 to-cyan-500' },
  'among us': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'from-red-500 to-pink-500' },
  'fall guys': { bg: 'bg-pink-500/10', text: 'text-pink-400', dot: 'from-pink-500 to-rose-500' },
  'rocket league': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'from-blue-500 to-orange-500' },
  'default': { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'from-gray-500 to-gray-600' }
};

/**
 * Get color scheme for a game name
 */
export function getGameColors(gameName) {
  if (!gameName) return gameColors.default;
  
  const normalizedName = gameName.toLowerCase().trim();
  return gameColors[normalizedName] || gameColors.default;
}
