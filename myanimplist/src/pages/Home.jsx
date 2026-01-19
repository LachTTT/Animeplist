import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GENRES = [
  {
    label: "Romance & Comedy",
    queryGenres: ["Romance", "Comedy"],
    icon: "💕",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    label: "Action",
    queryGenres: ["Action"],
    icon: "⚔️",
    gradient: "from-red-500 to-orange-500",
  },
  {
    label: "Music",
    queryGenres: ["Music"],
    icon: "🎵",
    gradient: "from-purple-500 to-indigo-500",
  },
];

export default function Home() {
  const [best, setBest] = useState([]);
  const [genreData, setGenreData] = useState({});
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Best Anime (score > 80) ---
  useEffect(() => {
    const bestQuery = `
      query {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: SCORE_DESC, averageScore_greater: 80) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
          }
        }
      }
    `;
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: bestQuery }),
    })
      .then((r) => r.json())
      .then((res) => {
        setBest(res.data.Page.media);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // --- Fetch Trending Now (all anime) ---
  useEffect(() => {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
          }
        }
      }
    `;
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((r) => r.json())
      .then((res) => setTrending(res.data.Page.media))
      .catch(console.error);
  }, []);

  // --- Fetch Trending by Genre (including Romance + Comedy combo) ---
  useEffect(() => {
    GENRES.forEach(({ label, queryGenres }) => {
      const query = `
        query {
          Page(page: 1, perPage: 10) {
            media(type: ANIME, sort: TRENDING_DESC, genre_in: ${JSON.stringify(
              queryGenres
            )}) {
              id
              title { romaji english }
              coverImage { large }
              averageScore
            }
          }
        }
      `;
      fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
        .then((r) => r.json())
        .then((res) =>
          setGenreData((prev) => ({ ...prev, [label]: res.data.Page.media }))
        )
        .catch(console.error);
    });
  }, []);

  const AnimeCard = ({ item, index }) => (
    <Link
      to={`/anime/${item.id}`}
      className="group relative flex-shrink-0 w-44 sm:w-52"
    >
      {/* Animated glow ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl opacity-0 " />

      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-500 group-hover:shadow-2xl border-2 border-transparent group-hover:border-white">
        {/* Rank badge for top items */}
        {index < 3 && (
          <div className="absolute top-3 left-3 z-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg ring-4 ring-yellow-400/30">
            {index + 1}
          </div>
        )}

        {/* Image */}
        <div className="aspect-[2/3] overflow-hidden bg-gray-200 relative">
          <img
            src={item.coverImage.large}
            alt={item.title.english || item.title.romaji}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Animated border shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Score badge */}
        {item.averageScore && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full text-white font-bold text-sm shadow-lg ring-2 ring-blue-400/50 group-hover:ring-4 group-hover:ring-blue-400/70 transition-all duration-300">
            ⭐ {item.averageScore}%
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent">
          <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-lg group-hover:text-blue-200 transition-colors duration-300">
            {item.title.english || item.title.romaji}
          </h3>
        </div>

        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-br-2xl" />
      </div>
    </Link>
  );

  const AnimeRow = ({ items }) => (
    <div className="relative">
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-transparent hover:scrollbar-thumb-blue-500/70">
        {items.map((item, index) => (
          <AnimeCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">
            Loading amazing anime...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in">
            Discover Anime
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl">
            Explore trending shows, top-rated series, and find your next
            favorite anime
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 sm:px-8 lg:px-12 py-12 space-y-16">
        {/* Trending Now */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🔥
              </div>
              <div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Trending Now
                </h2>
                <p className="text-gray-600 text-sm">
                  What everyone's watching right now
                </p>
              </div>
            </div>
          </div>
          <AnimeRow items={trending} />
        </section>

        {/* Best Anime */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>
            <div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Best Anime Shows
              </h2>
              <p className="text-gray-600 text-sm">
                Top-rated series with 80+ scores
              </p>
            </div>
          </div>
          <AnimeRow items={best} />
        </section>

        {/* Trending by Genre */}
        {GENRES.map(({ label, icon, gradient }) => (
          <section key={label}>
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
              >
                {icon}
              </div>
              <div>
                <h2
                  className={`text-4xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                >
                  {label}
                </h2>
                <p className="text-gray-600 text-sm">
                  Popular in {label.toLowerCase()}
                </p>
              </div>
            </div>
            <AnimeRow items={genreData[label] || []} />
          </section>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
