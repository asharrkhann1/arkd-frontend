import { Users, Coins, Package, Wallet, Gift, Zap, Gamepad2 } from 'lucide-react';

export const SERVICE_TYPE_ALIASES = {
    account: 'accounts',
    accounts: 'accounts',
    currency: 'currency',
    currencies: 'currency',
    item: 'items',
    items: 'items',
    topup: 'topups',
    topups: 'topups',
    giftcard: 'giftcards',
    giftcards: 'giftcards',
};

export const normalizeServiceType = (type = '') => {
    const key = String(type).toLowerCase().replace(/-/g, '');
    return SERVICE_TYPE_ALIASES[key] || key;
};

export const serviceConfigs = {
    accounts: {
        id: 'accounts',
        title: 'Accounts',
        name: 'Accounts',
        description: 'Get game accounts instantly',
        href: '/services/accounts',
        getHref: (cat) => cat ? `/services/accounts/${cat}` : '/services/accounts',
        icon: Users,
        color: 'from-orange-500 to-red-500',
        badge: 'Hot'
    },
    currency: {
        id: 'currency',
        title: 'Currency',
        name: 'Currency',
        description: 'Cheapest game currency deals',
        href: '/services/currency',
        getHref: (cat) => cat ? `/services/currency/${cat}` : '/services/currency',
        icon: Coins,
        color: 'from-yellow-500 to-orange-500'
    },
    items: {
        id: 'items',
        title: 'Items',
        name: 'Items',
        description: 'Unlock in-game items fast',
        href: '/services/items',
        getHref: (cat) => cat ? `/services/items/${cat}` : '/services/items',
        icon: Package,
        color: 'from-purple-500 to-indigo-500'
    },
    topups: {
        id: 'topups',
        title: 'Top Ups',
        name: 'Top Ups',
        description: 'Top-up in-game balance instantly',
        href: '/services/topups',
        getHref: (cat) => cat ? `/services/topups/${cat}` : '/services/topups',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500'
    },
    giftcards: {
        id: 'giftcards',
        title: 'Gift cards',
        name: 'Gift cards',
        description: 'Codes for all games and platforms',
        href: '/services/giftcards',
        getHref: (cat) => cat ? `/services/giftcards/${cat}` : '/services/giftcards',
        icon: Gift,
        color: 'from-blue-500 to-cyan-500'
    }
};

export const getServiceConfig = (type) => serviceConfigs[normalizeServiceType(type)] || null;
