import { Users, Coins, Package, Gift, Zap, Gamepad2, CreditCard, Wallet } from 'lucide-react';

/**
 * Browse Section Icons
 * Maps service types to their corresponding Lucide icons
 */

export const browseIcons = {
    accounts: Users,
    'game-accounts': Gamepad2,
    currencies: Coins,
    items: Package,
    topups: Zap,
    giftcards: Gift,
    wallet: Wallet,
    payment: CreditCard,
};

/**
 * Icon color mappings for browse cards
 */
export const browseIconColors = {
    accounts: { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'from-orange-500 to-red-500' },
    'game-accounts': { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'from-green-500 to-emerald-500' },
    currencies: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'from-yellow-500 to-orange-500' },
    items: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'from-purple-500 to-indigo-500' },
    topups: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'from-blue-500 to-cyan-500' },
    giftcards: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'from-cyan-500 to-blue-500' },
    wallet: { bg: 'bg-pink-500/10', text: 'text-pink-400', dot: 'from-pink-500 to-rose-500' },
    payment: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'from-indigo-500 to-violet-500' },
};

/**
 * Get icon component for a service type
 */
export function getBrowseIcon(serviceType) {
    return browseIcons[serviceType] || Users;
}

/**
 * Get color scheme for a service type
 */
export function getBrowseColors(serviceType) {
    return browseIconColors[serviceType] || browseIconColors.accounts;
}
