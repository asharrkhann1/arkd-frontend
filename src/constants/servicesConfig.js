import { Users, Coins, Package, Wallet, Gift, Zap, Gamepad2 } from 'lucide-react';

export const serviceConfigs = {
    accounts: {
        id: 'accounts',
        title: 'Accounts',
        name: 'Accounts',
        description: 'Get game accounts instantly',
        href: '/services/accounts',
        getHref: (cat) => cat ? `/services/accounts/${cat}` : '/services/accounts',
        icon: Users,
        color: 'from-orange-600 to-orange-400',
        badge: 'Hot'
    },
    currencies: {
        id: 'currencies',
        title: 'Currencies',
        name: 'Currencies',
        description: 'Cheapest game currency deals',
        href: '/services/currencies',
        getHref: (cat) => cat ? `/services/currencies/${cat}` : '/services/currencies',
        icon: Coins,
        color: 'from-orange-600 to-orange-400'
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
        color: 'from-orange-600 to-orange-400'
    },
    giftcards: {
        id: 'giftcards',
        title: 'Gift cards',
        name: 'Gift cards',
        description: 'Codes for all games and platforms',
        href: '/services/giftcards',
        getHref: (cat) => cat ? `/services/giftcards/${cat}` : '/services/giftcards',
        icon: Gift,
        color: 'from-orange-600 to-orange-400'
    },
    currency: {
        id: 'currency',
        title: 'Currency',
        name: 'Currency',
        description: 'Buy game currency at best rates',
        href: '/services/currency',
        getHref: (cat) => cat ? `/services/currency/${cat}` : '/services/currency',
        icon: Wallet,
        color: 'from-orange-600 to-orange-400'
    }
};
