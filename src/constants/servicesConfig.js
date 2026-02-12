import { Users, Coins, Package, Wallet, Gift, Zap, Gamepad2 } from 'lucide-react';

export const serviceConfigs = {
    accounts: {
        id: 'accounts',
        title: 'Accounts',
        name: 'Game Accounts',
        description: 'Get game accounts instantly',
        href: '/services/accounts',
        getHref: (cat) => cat ? `/services/accounts/${cat}` : '/services/accounts',
        icon: Users,
        color: 'from-orange-500 to-red-500',
        badge: 'Hot'
    },
    'game-accounts': {
        id: 'game-accounts',
        title: 'Game Accounts',
        name: 'Game Accounts',
        description: 'Premium game accounts for all platforms',
        href: '/services/game-accounts',
        getHref: (cat) => cat ? `/services/game-accounts/${cat}` : '/services/game-accounts',
        icon: Gamepad2,
        color: 'from-green-500 to-emerald-500',
        badge: 'New'
    },
    currencies: {
        id: 'currencies',
        title: 'Currencies',
        name: 'Currencies',
        description: 'Cheapest game currency deals',
        href: '/services/currencies',
        getHref: (cat) => cat ? `/services/currencies/${cat}` : '/services/currencies',
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
