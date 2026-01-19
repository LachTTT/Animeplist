// src/components/AnimeList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AnimeList({ searchQuery }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchAnime(searchTerm = "", pageNumber = 1) {
    setLoading(true);
    const gql = `
      query ($page: Int, $search: String) {
        Page(page: $page, perPage: 24 ) {
          pageInfo { currentPage lastPage }
          media(type: ANIME, sort: POPULARITY_DESC, search: $search) {
            id
            title { romaji english }
            coverImage { large }
          }
        }
      }
    `;
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: gql,
          variables: { page: pageNumber, search: searchTerm || undefined },
        }),
      });
      const data = await res.json();
      const info = data.data.Page.pageInfo;
      setResults(data.data.Page.media);
      setPage(info.currentPage);
      setTotalPages(info.lastPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnime(searchQuery, 1);
  }, [searchQuery]);

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    fetchAnime(searchQuery, p);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {searchQuery ? `Results for "${searchQuery}"` : "Discover Anime"}
          </h2>
          <p className="text-gray-600 text-lg">
            {searchQuery ? `Found ${results.length} results` : "Popular anime series and movies"}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* Modern card grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Image container with aspect ratio */}
                <div className="aspect-[2/3] relative overflow-hidden bg-gray-200">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 drop-shadow-lg">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-3 flex-wrap">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:shadow-lg transition-all font-medium"
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
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110"
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
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:shadow-lg transition-all font-medium"
            >
              Next →
            </button>
          </div>
        )}

        {/* No results state */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 font-semibold">No anime found</p>
            <p className="text-gray-500 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </section>
  );
}