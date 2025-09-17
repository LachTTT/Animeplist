// src/components/AnimeList.jsx
import { useState, useEffect } from "react";

export default function AnimeList({ searchQuery }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchAnime(searchTerm = "", pageNumber = 1) {
    setLoading(true);
    const gql = `
      query ($page: Int, $search: String) {
        Page(page: $page, perPage: 40) {
          pageInfo {
            currentPage
            lastPage
          }
          media(
            type: ANIME
            sort: POPULARITY_DESC
            search: $search
          ) {
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

  // first load
  useEffect(() => {
    fetchAnime(searchQuery, 1);
  }, [searchQuery]);

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    fetchAnime(searchQuery, p);
  }

  return (
    <section className="px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {searchQuery ? `Results for “${searchQuery}”` : "All Anime"}
      </h2>

      {loading && <p className="text-center text-lg font-semibold">Loading…</p>}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results.map((anime) => (
          <div
            key={anime.id}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={anime.coverImage.large}
              alt={anime.title.english || anime.title.romaji}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <p className="absolute bottom-2 w-full text-center text-sm font-bold text-white px-1 group-hover:text-lg transition-all">
              {anime.title.english || anime.title.romaji}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)
            )
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;
              return (
                <span key={p}>
                  {showEllipsis && <span className="px-2">…</span>}
                  <button
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1 rounded ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              );
            })}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="text-center text-gray-600 mt-6">No results found.</p>
      )}
    </section>
  );
}
