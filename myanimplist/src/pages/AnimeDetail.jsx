import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandDesc, setExpandDesc] = useState(false);

  useEffect(() => {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { extraLarge color }
          bannerImage
          description(asHtml: false)
          episodes
          averageScore
          genres
          status
          season
          seasonYear
          duration
          format
          source
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-purple-400 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-24 w-24 border-4 border-purple-300 opacity-20"></div>
          </div>
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-6 animate-bounce">😕</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Anime Not Found
          </h1>
          <p className="text-gray-300 mb-8">The anime you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const bgImage = anime.bannerImage || anime.coverImage.extraLarge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Banner with Parallax Effect */}
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-transparent to-pink-900/40 animate-pulse" />
        
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-black/30 backdrop-blur-xl rounded-2xl text-white hover:bg-black/50 transition-all duration-300 shadow-2xl border border-white/10 hover:border-white/30 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative -mt-64 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Info Card */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Animated border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-20 blur-xl animate-pulse" />
            
            <div className="relative flex flex-col lg:flex-row gap-10 p-8 lg:p-12">
              {/* Cover Image with Enhanced Effects */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500" />
                  
                  <img
                    src={anime.coverImage.extraLarge}
                    alt={anime.title.english || anime.title.romaji}
                    className="relative w-full lg:w-80 rounded-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 border-4 border-white/10 group-hover:border-white/30"
                  />
                  
                  {/* Score badge with animation */}
                  {anime.averageScore && (
                    <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl ring-4 ring-yellow-400/30 hover:ring-8 hover:ring-yellow-400/50 transition-all duration-300 cursor-pointer hover:scale-110">
                      ⭐ {anime.averageScore}
                      <span className="text-sm opacity-80">%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Content */}
              <div className="flex-1 space-y-8 text-white">
                {/* Title Section */}
                <div>
                  <h1 className="text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent leading-tight">
                    {anime.title.english || anime.title.romaji}
                  </h1>
                  {anime.title.native && (
                    <p className="text-xl text-purple-200 font-medium">{anime.title.native}</p>
                  )}
                </div>

                {/* Genres with Enhanced Style */}
                <div className="flex flex-wrap gap-3">
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/genre/${encodeURIComponent(genre)}`}
                      className="relative group px-5 py-2.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-400/30 rounded-xl text-sm font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50"
                    >
                      <span className="relative z-10">{genre}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>

                {/* Stats Grid with Icons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {anime.episodes && (
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 group cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl group-hover:scale-125 transition-transform">📺</span>
                        <p className="text-sm text-purple-300 font-semibold">Episodes</p>
                      </div>
                      <p className="text-3xl font-bold">{anime.episodes}</p>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 group cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl group-hover:scale-125 transition-transform">⏱️</span>
                        <p className="text-sm text-blue-300 font-semibold">Duration</p>
                      </div>
                      <p className="text-3xl font-bold">{anime.duration}<span className="text-lg ml-1">min</span></p>
                    </div>
                  )}
                  {anime.status && (
                    <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-5 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105 group cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl group-hover:scale-125 transition-transform">📡</span>
                        <p className="text-sm text-green-300 font-semibold">Status</p>
                      </div>
                      <p className="text-xl font-bold">{anime.status}</p>
                    </div>
                  )}
                  {anime.season && (
                    <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-5 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 group cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl group-hover:scale-125 transition-transform">📅</span>
                        <p className="text-sm text-orange-300 font-semibold">Season</p>
                      </div>
                      <p className="text-lg font-bold">{anime.season} {anime.seasonYear}</p>
                    </div>
                  )}
                </div>

                {/* Studio & Format Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anime.studios.nodes.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎬</span>
                        <p className="text-sm text-purple-300 font-semibold">Studio</p>
                      </div>
                      <p className="text-lg font-bold">
                        {anime.studios.nodes.map((s) => s.name).join(", ")}
                      </p>
                    </div>
                  )}
                  {anime.format && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎞️</span>
                        <p className="text-sm text-purple-300 font-semibold">Format</p>
                      </div>
                      <p className="text-lg font-bold">{anime.format}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {anime.description && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                      <span className="text-2xl">📖</span>
                      Synopsis
                    </h2>
                    <p 
                      className={`text-gray-200 leading-relaxed ${expandDesc ? '' : 'line-clamp-4'} transition-all cursor-pointer hover:text-white`}
                      onClick={() => setExpandDesc(!expandDesc)}
                    >
                      {anime.description}
                    </p>
                    <button
                      onClick={() => setExpandDesc(!expandDesc)}
                      className="mt-3 text-purple-400 hover:text-purple-300 font-semibold text-sm flex items-center gap-1"
                    >
                      {expandDesc ? 'Show less' : 'Read more'}
                      <svg className={`w-4 h-4 transition-transform ${expandDesc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Characters Section */}
          {anime.characters && anime.characters.edges.length > 0 && (
            <div className="mt-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  👥
                </div>
                <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Characters
                </span>
              </h2>
              
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar">
                  {anime.characters.edges.map(({ node, role }) => (
                    <div key={node.id} className="group flex-shrink-0 w-44 relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                      
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/10 transition-all duration-300 hover:border-purple-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
                        {/* Character Image */}
                        <div className="relative h-60 overflow-hidden">
                          <img
                            src={node.image.medium}
                            alt={node.name.full}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          
                          {/* Role badge */}
                          <div className="absolute top-3 right-3 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg ring-2 ring-white/20">
                            {role}
                          </div>
                        </div>
                        
                        {/* Character Name */}
                        <div className="p-4 bg-gradient-to-b from-transparent to-black/40">
                          <p className="font-bold text-white text-sm leading-tight line-clamp-2 text-center">
                            {node.name.full}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}