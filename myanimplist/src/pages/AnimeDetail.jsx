import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { extraLarge color }
          bannerImage       # <-- Add this to get another image
          description(asHtml: false)
          episodes
          averageScore
          genres
          status
          season
          seasonYear
          duration
          studios { nodes { name } }
          characters(sort: ROLE, perPage: 12) {
            edges {
              role
              node { id name { full } image { medium } }
            }
          }
        }
      }
    `;
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id: Number(id) } }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAnime(data.data.Media);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading…</p>;
  if (!anime) return <p className="text-center mt-10">Anime not found.</p>;

  // pick a nice background: bannerImage if present, otherwise coverImage
  const bgImage = anime.bannerImage || anime.coverImage.extraLarge;

  return (
    <section className="relative">
      {/* Blurred background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center blur"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Foreground content */}
      <div className="relative px-6 py-10 max-w-5xl mx-auto space-y-10">
        {/* Main Anime Info */}
        <div className="flex flex-col md:flex-row gap-6 bg-blue-950 rounded-2xl px-4 py-8">
          <img
            src={anime.coverImage.extraLarge}
            alt={anime.title.english || anime.title.romaji}
            className="w-64 rounded-lg shadow-lg"
          />
          <div className="flex-1 space-y-4 text-white">
            <h1 className="text-4xl font-bold">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="italic opacity-80">{anime.title.native}</p>
            <p dangerouslySetInnerHTML={{ __html: anime.description }} />
            <ul className="space-y-1 mt-4 text-sm">
              <li>
                <strong>Episodes:</strong> {anime.episodes ?? "N/A"}
              </li>
              <li>
                <strong>Average Score:</strong> {anime.averageScore ?? "N/A"}%
              </li>
              <li>
                <strong>Genres:</strong>{" "}
                <div className="flex flex-wrap gap-2 mt-1">
                  {anime.genres.map((g) => (
                    <Link
                      key={g}
                      to={`/genre/${encodeURIComponent(g)}`}
                      className="
    relative inline-block px-3 py-1 text-white text-xs font-semibold
    overflow-hidden rounded-full
    transition-colors duration-300
    group
  "
                    >
                      {/* expanding background */}
                      <span
                        className="
      absolute inset-0 bg-white
      transform scale-x-0 origin-left
      transition-transform duration-300
      group-hover:scale-x-100
    "
                      />
                      {/* text sits above the background */}
                      <span className="relative group-hover:text-gray-900 transition-colors duration-300">
                        {g}
                      </span>
                    </Link>
                  ))}
                </div>
              </li>

              <li>
                <strong>Status:</strong> {anime.status}
              </li>
              <li>
                <strong>Season:</strong> {anime.season} {anime.seasonYear}
              </li>
              <li>
                <strong>Duration:</strong> {anime.duration} min/ep
              </li>
              <li>
                <strong>Studios:</strong>{" "}
                {anime.studios.nodes.map((s) => s.name).join(", ")}
              </li>
            </ul>
          </div>
        </div>

        {/* Characters Section */}
        {anime.characters && anime.characters.edges.length > 0 && (
          <div className="text-white bg-blue-950 px-4 pt-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Characters</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {anime.characters.edges.map(({ node, role }) => (
                <div
                  key={node.id}
                  className="min-w-[120px] w-28 flex-shrink-0 text-center"
                >
                  <img
                    src={node.image.medium}
                    alt={node.name.full}
                    className="rounded-lg shadow-lg w-full h-36 object-cover"
                  />
                  <p className="font-semibold mt-2">{node.name.full}</p>
                  <p className="text-sm opacity-80">{role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
