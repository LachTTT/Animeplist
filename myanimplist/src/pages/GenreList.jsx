import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GenreList() {
  const { genre } = useParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  }, [genre]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    fetchByGenre(p);
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading…</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Genre: {genre}
      </h1>

      {/* === Responsive poster grid === */}
      <div
        className="
          grid gap-4 sm:gap-6
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
        "
      >
        {animes.map((a) => (
          <div key={a.id} className="text-center">
            <Link
              to={`/anime/${a.id}`}
              className="block transform transition duration-300 hover:scale-105"
            >
              <div
                className="
                  relative mx-auto rounded-xl shadow-lg overflow-hidden
                  w-36 h-60 sm:w-40 sm:h-72 md:w-44 md:h-80
                "
              >
                {/* Poster image fills the rectangle */}
                <img
                  src={a.coverImage.large}
                  alt={a.title.english || a.title.romaji}
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                {/* Title text at the bottom */}
                <p
                  className="
                    absolute bottom-3 left-1/2 -translate-x-1/2
                    text-center text-white font-semibold
                    text-sm sm:text-base px-2 line-clamp-2
                  "
                >
                  {a.title.english || a.title.romaji}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination (unchanged logic, slightly wider gap) */}
      {totalPages > 1 && (
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
    </div>
  );
}
