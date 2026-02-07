import { Users, Coins, Package, Sparkles, User, Gift, Headphones, Shield, Star, Clock, Flame, Gamepad2, Zap } from 'lucide-react';

export const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
];

export const recentGames = [
    { id: 'valorant', name: 'Valorant', icon: '🎮' },
    { id: 'fortnite', name: 'Fortnite', icon: '🎯' },
    { id: 'lol', name: 'League of Legends', icon: '⚔️' },
];

export const popularGames = [
    { id: 'fortnite', name: 'Fortnite', icon: '🎯', services: 3 },
    { id: 'valorant', name: 'Valorant', icon: '🎮', services: 3 },
    { id: 'clash-royale', name: 'Clash Royale', icon: '🏰', services: 2 },
    { id: 'roblox', name: 'Roblox', icon: '🎲', services: 3 },
    { id: 'lol', name: 'League of Legends', icon: '⚔️', services: 5 },
    { id: 'osrs', name: 'Old School RuneScape', icon: '🔫', services: 4 },
    { id: 'call-of-duty', name: 'Call Of Duty', icon: '⛏️', services: 2 },
    { id: 'gta-v', name: 'Grand Theft Auto V', icon: '🎯', services: 3 },
];

export const gameServices = {
    valorant: [
        { id: 1, name: 'Accounts', icon: Users, stock: '2.4k in stock', color: 'blue' },
        { id: 2, name: 'Valorant-Points', icon: Coins, stock: 'Instant delivery', color: 'green' },
    ],
    osrs: [
        { id: 1, name: 'Accounts', icon: Users, stock: '2.4k in stock', color: 'blue' },
        { id: 2, name: 'Gold', icon: Coins, stock: 'Instant delivery', color: 'green' },
        { id: 3, name: 'GiftCard', icon: Package, stock: 'Skins & more', color: 'purple' },
    ],
    fortnite: [
        { id: 1, name: 'Accounts', icon: Users, stock: '3.1k in stock', color: 'blue' },
        { id: 3, name: 'Items', icon: Package, stock: 'Skins & more', color: 'green' },
        { id: 2, name: 'V-Bucks', icon: Coins, stock: 'Instant delivery', color: 'purple' },
    ],
    lol: [
        { id: 1, name: 'Accounts', icon: Users, stock: '5.2k in stock', color: 'blue' },
        { id: 2, name: 'Items', icon: Coins, stock: 'Instant delivery', color: 'green' },
        { id: 3, name: 'Topup', icon: Sparkles, stock: '1.2k skins', color: 'purple' },
    ],
    roblox: [
        { id: 1, name: 'Accounts', icon: Users, stock: '5.2k in stock', color: 'blue' },
        { id: 2, name: 'Items', icon: Coins, stock: 'Instant delivery', color: 'green' },
        { id: 3, name: 'GiftCard', icon: Sparkles, stock: '1.2k skins', color: 'purple' },
        { id: 4, name: 'Robux', icon: Sparkles, stock: '1.2k skins', color: 'red' },
    ],
    apex: [
        { id: 1, name: 'Accounts', icon: Users, stock: '5.2k in stock', color: 'blue' },
        { id: 2, name: 'Items', icon: Coins, stock: 'Instant delivery', color: 'green' },
        { id: 3, name: 'GiftCard', icon: Sparkles, stock: '1.2k skins', color: 'purple' },
        { id: 4, name: 'Robux', icon: Sparkles, stock: '1.2k skins', color: 'red' },
    ],
    "gta-v": [
        { id: 1, name: 'Accounts', icon: Users, stock: '2.4k in stock', color: 'blue' },
    ],
    "call-of-duty": [
        { id: 1, name: 'Accounts', icon: Users, stock: '2.4k in stock', color: 'blue' },
        { id: 2, name: 'Points', icon: Coins, stock: 'Instant delivery', color: 'green' },
    ],
    "clash-royale": [
        { id: 1, name: 'Accounts', icon: Users, stock: '2.4k in stock', color: 'blue' },
        { id: 2, name: 'TopUps', icon: Coins, stock: 'Instant delivery', color: 'green' },
        { id: 3, name: 'GiftCard', icon: Package, stock: 'Skins & more', color: 'purple' },
    ],
};
