import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  Globe,
  ChevronDown,
  Users,
  Coins,
  Gift,
  Package,
  Wallet,
  Star,
  Sparkles,
  Zap,
  Headphones,
  Shield,
  Clock,
  Flame,
  ArrowUpDown,
  Gamepad2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ClashRoyalePage from '../../pages/ClashRoyale';

const Header: React.FC = () => {
  useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('valorant');
  const [sortOrder, setSortOrder] = useState<'popular' | 'az'>('popular');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const servicesRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  ];

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' },
  ];

  const recentGames = [
    { id: 'valorant', name: 'Valorant', icon: '🎮' },
    { id: 'fortnite', name: 'Fortnite', icon: '🎯' },
    { id: 'lol', name: 'League of Legends', icon: '⚔️' },
  ];

  const popularGames = [
    { id: 'fortnite', name: 'Fortnite', icon: '🎯', services: 3 },
    { id: 'valorant', name: 'Valorant', icon: '🎮', services: 3 },
    { id: 'clash-royale', name: 'Clash Royale', icon: '🏰', services: 2 },
    { id: 'roblox', name: 'Roblox', icon: '🎲', services: 3 },
    { id: 'lol', name: 'League of Legends', icon: '⚔️', services: 5 },
    { id: 'osrs', name: 'Old School RuneScape', icon: '🔫', services: 4 },
    { id: 'call-of-duty', name: 'Call Of Duty', icon: '⛏️', services: 2 },
    { id: 'gta-v', name: 'Grand Theft Auto V', icon: '🎯', services: 3 },
  ];

  const gameServices: Record<string, any[]> = {
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

  const filteredGames = popularGames
    .filter(game =>
      game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'az') {
        return a.name.localeCompare(b.name);
      }
      return b.services - a.services;
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
      if (gamesRef.current && !gamesRef.current.contains(event.target as Node)) {
        setGamesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleLocaleChange = (currency: string, language: string) => {
    setSelectedCurrency(currency);
    setSelectedLanguage(language);
    setLocaleMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Main Navigation */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GM</span>
                </div>
                <span className="text-xl font-bold text-white">
                  GameMarket
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
              {/* Services Mega Menu */}
              <div
                className="relative"
                ref={servicesRef}
                onMouseEnter={() => setServicesMenuOpen(true)}
                onMouseLeave={() => setServicesMenuOpen(false)}
              >
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {servicesMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        style={{ top: '64px' }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 -ml-20 mt-2 w-[95vw] max-w-[850px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        {/* Services Grid - Single Row */}
                        <div className="grid grid-cols-3 gap-6 p-6">
                          {/* Column 1 */}
                          <div className="space-y-2">
                            <Link
                              to="/services/accounts"
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-800/60 transition-all duration-200"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <div className="p-2 bg-orange-900/20 rounded-lg group-hover:bg-orange-600/30 transition-colors border border-orange-900/30">
                                <Users className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">Accounts</h3>
                                <p className="text-xs text-gray-400">Get game accounts instantly</p>
                              </div>
                            </Link>

                            <Link
                              to="/services/currencies"
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-800/60 transition-all duration-200"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <div className="p-2 bg-orange-900/20 rounded-lg group-hover:bg-orange-600/30 transition-colors border border-orange-900/30">
                                <Coins className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">Currencies</h3>
                                <p className="text-xs text-gray-400">Cheapest game currency deals</p>
                              </div>
                            </Link>
                          </div>

                          {/* Column 2 */}
                          <div className="space-y-2">
                            <Link
                              to="/services/items"
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-800/60 transition-all duration-200"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <div className="p-2 bg-orange-900/20 rounded-lg group-hover:bg-orange-600/30 transition-colors border border-orange-900/30">
                                <Package className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">Items</h3>
                                <p className="text-xs text-gray-400">Unlock in-game items fast</p>
                              </div>
                            </Link>

                            <Link
                              to="/services/top-ups"
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-800/60 transition-all duration-200"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <div className="p-2 bg-orange-900/20 rounded-lg group-hover:bg-orange-600/30 transition-colors border border-orange-900/30">
                                <Wallet className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">Top Ups</h3>
                                <p className="text-xs text-gray-400">Top-up in-game balance instantly</p>
                              </div>
                            </Link>
                          </div>

                          {/* Column 3 - Gift Cards */}
                          <div className="space-y-2">
                            <Link
                              to="/services/gift-cards"
                              className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-800/60 transition-all duration-200"
                              onClick={() => setServicesMenuOpen(false)}
                            >
                              <div className="p-2 bg-orange-900/20 rounded-lg group-hover:bg-orange-600/30 transition-colors border border-orange-900/30">
                                <Gift className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold group-hover:text-orange-500 transition-colors">Gift Cards</h3>
                                <p className="text-xs text-gray-400">Codes for all games and platforms</p>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Bottom Bar - Feature Highlights */}
                        <div className="border-t border-gray-700 bg-gray-900/50 px-8 py-3">
                          <div className="flex items-center justify-around">
                            <div className="flex items-center space-x-2 text-sm">
                              <Zap className="w-4 h-4 text-orange-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" />
                              <span className="text-gray-300 font-medium">Instant Delivery</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Headphones className="w-4 h-4 text-orange-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" />
                              <span className="text-gray-300 font-medium">24/7 Support</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Shield className="w-4 h-4 text-orange-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]" />
                              <span className="text-gray-300 font-medium">Free Warranty</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                              <span className="text-gray-300 font-medium">+1.3M Reviews</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Games Mega Menu */}
              <div
                className="relative"
                ref={gamesRef}
                onMouseEnter={() => setGamesMenuOpen(true)}
                onMouseLeave={() => setGamesMenuOpen(false)}
              >
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-orange-500 transition-colors py-2"
                >
                  <span>Games</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${gamesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {gamesMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        style={{ top: '64px' }}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 -ml-40 mt-2 w-[95vw] max-w-[1200px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="grid grid-cols-10 divide-x divide-gray-700">
                          {/* Left Sidebar - 20% */}
                          <div className="col-span-2 p-6 space-y-6">
                            {/* Recent Games */}
                            <div>
                              <div className="flex items-center space-x-2 mb-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Recent</h3>
                              </div>
                              <div className="space-y-2">
                                {recentGames.map((game) => (
                                  <button
                                    key={game.id}
                                    onClick={() => setSelectedGame(game.id)}
                                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                      selectedGame === game.id
                                        ? 'bg-orange-900/30 text-orange-500'
                                        : 'hover:bg-gray-800/60 text-gray-300'
                                    }`}
                                  >
                                    <span className="text-2xl">{game.icon}</span>
                                    <span className="text-sm font-medium truncate">{game.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Most Popular */}
                            <div>
                              <div className="flex items-center space-x-2 mb-3">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Most Popular</h3>
                              </div>
                              <div className="space-y-2">
                                {popularGames.slice(0, 6).map((game) => (
                                  <button
                                    key={game.id}
                                    onClick={() => setSelectedGame(game.id)}
                                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                                      selectedGame === game.id
                                        ? 'bg-orange-900/30 text-orange-500'
                                        : 'hover:bg-gray-800/60 text-gray-300'
                                    }`}
                                  >
                                    <span className="text-2xl">{game.icon}</span>
                                    <span className="text-sm font-medium truncate">{game.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Center Section - 50% */}
                          <div className="col-span-5 p-6">
                            {/* Search Bar */}
                            <div className="mb-4">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={gameSearchQuery}
                                  onChange={(e) => setGameSearchQuery(e.target.value)}
                                  placeholder="Search for a game..."
                                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                                />
                              </div>
                            </div>

                            {/* Sorting Buttons */}
                            <div className="flex items-center space-x-2 mb-4">
                              <button
                                onClick={() => setSortOrder('popular')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  sortOrder === 'popular'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                <Flame className="w-4 h-4" />
                                <span>Popular</span>
                              </button>
                              <button
                                onClick={() => setSortOrder('az')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  sortOrder === 'az'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                <ArrowUpDown className="w-4 h-4" />
                                <span>A–Z</span>
                              </button>
                            </div>

                            {/* Games Grid */}
                            <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                              {filteredGames.map((game) => (
                                <button
                                  key={game.id}
                                  onClick={() => setSelectedGame(game.id)}
                                  className={`group p-4 rounded-xl transition-all duration-200 ${
                                    selectedGame === game.id
                                      ? 'bg-orange-900/30 border-2 border-orange-500'
                                      : 'bg-gray-800/40 border-2 border-transparent hover:bg-gray-800/60 hover:border-gray-600'
                                  }`}
                                >
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className="text-4xl">{game.icon}</div>
                                    <h4 className={`text-sm font-semibold text-center ${
                                      selectedGame === game.id ? 'text-orange-500' : 'text-white'
                                    }`}>
                                      {game.name}
                                    </h4>
                                    <span className="text-xs text-gray-400">{game.services} services</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Right Panel - 30% */}
                          <div className="col-span-3 p-6 bg-gray-900/50">
                            <div className="flex items-center space-x-3 mb-4">
                              <Gamepad2 className="w-5 h-5 text-orange-500" />
                              <h3 className="text-lg font-bold text-white">
                                {popularGames.find(g => g.id === selectedGame)?.name || 'Select a Game'}
                              </h3>
                            </div>

                            <div className="space-y-3">
                              {(gameServices[selectedGame] || gameServices.valorant).map((service) => {
                                const IconComponent = service.icon;
                                const colorClasses = {
                                  red: 'from-red-500/20 to-red-500/20 border-red-500/30 hover:border-red-500/50',
                                  blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-500/50',
                                  green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50',
                                  purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50',
                                  orange: 'from-orange-500/20 to-orange-500/20 border-orange-500/30 hover:border-orange-500/50',
                                };

                                return (
                                  <Link
                                    key={service.id}
                                    to={`/${selectedGame}/${service.name.toLowerCase()}`}
                                    className={`group block p-4 rounded-xl bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} border-2 transition-all duration-300 hover:shadow-lg`}
                                    onClick={() => setGamesMenuOpen(false)}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3">
                                        <div className={`p-2 bg-${service.color}-500/20 rounded-lg`}>
                                          <IconComponent className={`w-5 h-5 text-${service.color}-400`} />
                                        </div>
                                        <div>
                                          <h4 className="text-white font-semibold group-hover:text-orange-500 transition-colors">
                                            {service.name}
                                          </h4>
                                          <p className="text-sm text-gray-400 mt-0.5">{service.stock}</p>
                                        </div>
                                      </div>
                                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                            
                            <Link
                              to={`/${selectedGame}`}
                              className="mt-4 block w-full py-3 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                              onClick={() => setGamesMenuOpen(false)}
                            >
                              View All Services
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Currency & Language Selector */}
              <div className="relative">
                <motion.button
                  onClick={() => setLocaleMenuOpen(!localeMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-300 hover:text-orange-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {selectedLanguage} | {selectedCurrency}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${localeMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {localeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 -ml-40 mt-2 w-72 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-lg shadow-xl z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Language & Currency</h3>
                      </div>

                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Languages Section - Left Side */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Language</h4>
                            <div className="space-y-1.5">
                              {languages.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => handleLocaleChange(selectedCurrency, lang.code)}
                                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all duration-200 ${
                                    selectedLanguage === lang.code
                                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                      : 'text-gray-300 hover:bg-gray-700/50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-xs">{lang.flag}</span>
                                    <div className="text-left">
                                      <div className="font-medium text-xs">{lang.name}</div>
                                      <div className="text-xs opacity-60">{lang.code}</div>
                                    </div>
                                  </div>
                                  {selectedLanguage === lang.code && (
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Currency Section - Right Side */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Currency</h4>
                            <div className="space-y-1.5">
                              {currencies.map((currency) => (
                                <button
                                  key={currency.code}
                                  onClick={() => handleLocaleChange(currency.code, selectedLanguage)}
                                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all duration-200 ${
                                    selectedCurrency === currency.code
                                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                      : 'text-gray-300 hover:bg-gray-700/50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-xs">{currency.flag}</span>
                                    <div className="text-left">
                                      <div className="font-medium text-xs">{currency.name}</div>
                                      <div className="text-xs opacity-60">{currency.code}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-bold text-xs">{currency.symbol}</span>
                                    {selectedCurrency === currency.code && (
                                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-gray-300 hover:text-orange-500 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-t-lg"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-b-lg w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-full hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>

                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-800 mt-4 pt-4"
              >
                <nav className="flex flex-col space-y-4">
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

export default Header;