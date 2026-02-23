import React, { useState } from "react";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameCard {
  id: number;
  name: string;
  displayName: string;
  image: string;
  bgColor: string;
  glowColor: string;
  width?: string;
  height?: string;
  route?: string;
}

const games: GameCard[] = [
  {
    id: 1,
    name: "Fortnite",
    displayName: "Fortnite",
    image: "/images/fortnite.png",
    bgColor: "from-red-900/20 to-rose-900/20",
    glowColor: "from-rose-500/40 via-red-500/30 to-rose-600/40",
    width: "w-120",
    height: "h-72",
    route: "/fortnite",
  },
  {
    id: 2,
    name: "World of Warcraft",
    displayName: "World of Warcraft",
    image: "/images/wow1.png",
    bgColor: "from-slate-900/20 to-gray-800/20",
    glowColor: "from-slate-600/40 via-gray-500/30 to-slate-700/40",
    width: "w-120",
    height: "h-72",
    route: "/world-of-warcraft",
  },
  {
    id: 3,
    name: "League of Legends",
    displayName: "League of Legends",
    image: "/images/pngwing.com (1).png",
    bgColor: "from-teal-900/20 to-cyan-900/20",
    glowColor: "from-cyan-500/40 via-teal-400/30 to-cyan-600/40",
    width: "w-120",
    height: "h-62",
    route: "/lol",
  },
  {
    id: 4,
    name: "Marvel Rivals",
    displayName: "Marvel Rivals",
    image: "/images/marvel rivals.png",
    bgColor: "from-yellow-900/20 to-orange-900/20",
    glowColor: "from-orange-500/40 via-yellow-500/30 to-orange-600/40",
    width: "w-120",
    height: "h-72",
    route: "/marvel-rivals",
  },
  {
    id: 5,
    name: "Rainbow Six Siege",
    displayName: "Rainbow Six Siege",
    image: "/images/Tom-Clancys-Rainbow-Six.png",
    bgColor: "from-gray-900/20 to-slate-800/20",
    glowColor: "from-slate-500/40 via-gray-600/30 to-slate-600/40",
    width: "w-120",
    height: "h-72",
    route: "/rainbow-six",
  },
  {
    id: 6,
    name: "Rocket League",
    displayName: "Rocket League",
    image: "/images/rocketleague.png",
    bgColor: "from-blue-900/20 to-indigo-900/20",
    glowColor: "from-indigo-500/40 via-blue-500/30 to-indigo-600/40",
    width: "w-120",
    height: "h-72",
    route: "/rocket-league",
  },
  {
    id: 7,
    name: "FC 26",
    displayName: "FC 26",
    image: "/images/fc26.png",
    bgColor: "from-green-900/20 to-emerald-900/20",
    glowColor: "from-emerald-500/40 via-green-500/30 to-emerald-600/40",
    width: "w-120",
    height: "h-72",
    route: "/fc-26",
  },
  {
    id: 8,
    name: "Valorant",
    displayName: "Valorant",
    image: "/images/yoru.png",
    bgColor: "from-red-900/20 to-rose-900/20",
    glowColor: "from-rose-500/40 via-red-500/30 to-rose-600/40",
    width: "w-120",
    height: "h-72",
    route: "/valorant",
  },
  {
    id: 9,
    name: "Clash Royale",
    displayName: "Clash Royale",
    image: "/images/ClashRoyale.png",
    bgColor: "from-blue-900/20 to-purple-900/20",
    glowColor: "from-blue-600/40 via-blue-500/30 to-purple-600/40",
    width: "w-120",
    height: "h-72",
    route: "/clash-royale",
  },
];

const AccountsPage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between overflow-hidden border border-[#f5d38b]/20 rounded-[20px] bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 mx-6 mt-8">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M50%,0 C75%,25% 75%,75% 50%,100%"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            fill="none"
            filter="url(#glow)"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8e9b0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f5d38b" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffd97a" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Left Section */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-10 py-16 space-y-6">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#f5d38b]/50 focus:bg-white/10 transition-all duration-300"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#f5d38b] via-[#e8c574] to-[#f5d38b] bg-clip-text text-transparent leading-tight">
            Boosting Market
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white">
            Elevate your boosting experience
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span>Rated</span>
              <span className="text-xl font-bold text-[#f5d38b]">4.9</span>
              <span className="text-xl text-yellow-400">★</span>
              <span>by over</span>
              <span className="font-semibold text-[#f5d38b]">10,000+</span>
              <span>customers</span>
            </div>

            <button className="bg-[#f5d38b] text-gray-950 font-semibold px-6 py-3 rounded-full hover:bg-[#e8c574] transition-all duration-300">
              Buy Now
            </button>
          </div>
        </div>

        {/* Right Side Video */}
        <div className="relative w-full lg:w-1/2 h-[400px] overflow-hidden">
          <div className="absolute inset-0 [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)] overflow-hidden">
            <video
              src="/Public/LOL background.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games
            .filter((g) =>
              g.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((game) => {
              const isHovered = hoveredCard === game.id;
              const isDimmed = hoveredCard !== null && hoveredCard !== game.id;

              return (
                <div
                  key={game.id}
                  onMouseEnter={() => setHoveredCard(game.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => game.route && navigate(game.route)} // ✅ ROUTE ADDED
                  className={`group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                    isDimmed ? "opacity-40 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                      isHovered ? game.glowColor : game.bgColor
                    }`}
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-2xl transition-all duration-500" />
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      {game.name}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <h3 className="text-6xl font-black text-white/5 uppercase tracking-tight text-center leading-none">
                        {game.displayName.split(" ")[0]}
                      </h3>
                    </div>
                    <img
                      src={game.image}
                      alt={game.displayName}
                      className={`absolute bottom-0 right-0 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                        game.width || "w-60"
                      } ${game.height || "h-80"}`}
                    />
                    <div className="flex justify-start">
                      <button className="relative overflow-hidden bg-gray-800/80 group-hover:bg-gray-800 rounded-full px-4 py-2.5 flex items-center gap-2 transition-all duration-500 group-hover:pr-5">
                        <span className="text-white text-sm font-semibold whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[80px] transition-all duration-500 overflow-hidden">
                          Buy Now
                        </span>
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-white transition-transform duration-500 group-hover:translate-x-1" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 hover:shadow-xl hover:shadow-orange-500/60"
        aria-label="Support Chat"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};

export default AccountsPage;
