import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Genre-specific colors and icons
const GENRE_THEMES = {
  Action: { gradient: "from-red-500 to-orange-500", icon: "⚔️", bg: "from-red-50 to-orange-50" },
  Adventure: { gradient: "from-green-500 to-teal-500", icon: "🗺️", bg: "from-green-50 to-teal-50" },
  Comedy: { gradient: "from-yellow-500 to-orange-400", icon: "😂", bg: "from-yellow-50 to-orange-50" },
  Drama: { gradient: "from-purple-500 to-pink-500", icon: "🎭", bg: "from-purple-50 to-pink-50" },
  Fantasy: { gradient: "from-indigo-500 to-purple-500", icon: "🔮", bg: "from-indigo-50 to-purple-50" },
  Horror: { gradient: "from-gray-700 to-red-700", icon: "👻", bg: "from-gray-50 to-red-50" },
  Mystery: { gradient: "from-slate-600 to-blue-600", icon: "🔍", bg: "from-slate-50 to-blue-50" },
  Romance: { gradient: "from-pink-500 to-rose-500", icon: "💕", bg: "from-pink-50 to-rose-50" },
  "Sci-Fi": { gradient: "from-cyan-500 to-blue-600", icon: "🚀", bg: "from-cyan-50 to-blue-50" },
  Slice: { gradient: "from-amber-500 to-yellow-500", icon: "🍃", bg: "from-amber-50 to-yellow-50" },
  Sports: { gradient: "from-orange-500 to-red-500", icon: "⚽", bg: "from-orange-50 to-red-50" },
  Supernatural: { gradient: "from-violet-600 to-purple-600", icon: "✨", bg: "from-violet-50 to-purple-50" },
  Thriller: { gradient: "from-red-600 to-rose-600", icon: "🔪", bg: "from-red-50 to-rose-50" },
  Music: { gradient: "from-purple-500 to-indigo-500", icon: "🎵", bg: "from-purple-50 to-indigo-50" },
  Mecha: { gradient: "from-gray-600 to-slate-700", icon: "🤖", bg: "from-gray-50 to-slate-50" },
};

export default function GenreList() {
  const { genre } = useParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const theme = GENRE_THEMES[genre] || { 
    gradient: "from-blue-500 to-indigo-500", 
    icon: "🎬", 
    bg: "from-blue-50 to-indigo-50" 
  };

  async function fetchByGenre(pageNumber = 1) {
    setLoading(true);
    const query = `
      query ($page: Int, $genre: String) {
        Page(page: $page, perPage: 24) {
          pageInfo { currentPage lastPage }
          media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
          }
        }
      }
    `;
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { genre, page: pageNumber } }),
      });
      const data = await res.json();
      const info = data.data.Page.pageInfo;
      setAnimes(data.data.Page.media);
      setPage(info.currentPage);
      setTotalPages(info.lastPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchByGenre(1);
    window.scrollTo(0, 0);
  }, [genre]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    fetchByGenre(p);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading {genre} anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${theme.gradient} text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl`}>
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              {theme.icon}
            </div>
            <div>
              <h1 className="text-5xl sm:text-6xl font-extrabold mb-2">
                {genre}
              </h1>
              <p className="text-xl text-white/90">
                {animes.length} popular anime in this genre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {animes.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Image container */}
                <div className="aspect-[2/3] relative overflow-hidden bg-gray-200">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Score badge */}
                {anime.averageScore && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600/90 backdrop-blur-sm rounded-full text-white font-bold text-sm shadow-lg">
                    ⭐ {anime.averageScore}%
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 drop-shadow-lg">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                </div>

                {/* Genre badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r ${theme.gradient} rounded-full text-white font-bold text-xs shadow-lg`}>
                  {genre}
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-3 flex-wrap">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-lg transition-all font-medium"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)
                )
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <span key={p} className="flex items-center gap-2">
                      {showEllipsis && <span className="text-gray-400 px-1">⋯</span>}
                      <button
                        onClick={() => goToPage(p)}
                        className={`min-w-[40px] h-10 rounded-lg font-semibold transition-all ${
                          p === page
                            ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg scale-110`
                            : "bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-lg transition-all font-medium"
            >
              Next →
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && animes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{theme.icon}</div>
            <p className="text-xl text-gray-600 font-semibold">No {genre} anime found</p>
            <Link to="/" className="text-blue-600 hover:text-blue-700 underline mt-4 inline-block">
              Explore other genres
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}