import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GENRES = [
  { label: "Romance & Comedy", queryGenres: ["Romance", "Comedy"] },
  { label: "Action", queryGenres: ["Action"] },
  { label: "Music", queryGenres: ["Music"] },
];

export default function Home() {
  const [best, setBest] = useState([]);
  const [genreData, setGenreData] = useState({});
  const [trending, setTrending] = useState([]);

  // --- Fetch Best Anime (score > 80) ---
  useEffect(() => {
    const bestQuery = `
      query {
        Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: SCORE_DESC, averageScore_greater: 80) {
            id
            title { romaji english }
            coverImage { large }
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
      .then((res) => setBest(res.data.Page.media))
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

  const AnimeRow = ({ items }) => (
    <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/anime/${item.id}`}
          className="group min-w-[160px] w-40 flex-shrink-0 relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <img
            src={item.coverImage.large}
            alt={item.title.english || item.title.romaji}
            className="h-56 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <p className="absolute bottom-2 w-full text-center text-sm font-bold text-white transition-all duration-300 group-hover:text-2xl">
            {item.title.english || item.title.romaji}
          </p>
        </Link>
      ))}
    </div>
  );

  return (
    <section className="px-6 py-8 space-y-12">
      {/* Global Trending */}
      <div>
        <h2 className="text-4xl font-bold mb-4">Trending Now!</h2>
        <AnimeRow items={trending} />
      </div>
      {/* Best Anime */}
      <div>
        <h2 className="text-3xl font-bold mb-4">Best Anime Shows</h2>
        <AnimeRow items={best} />
      </div>
      {/* Trending by Genre */}
      {GENRES.map(({ label }) => (
        <div key={label}>
          <h2 className="text-3xl font-bold mb-4">{label}</h2>
          <AnimeRow items={genreData[label] || []} />
        </div>
      ))}
    </section>
  );
}
