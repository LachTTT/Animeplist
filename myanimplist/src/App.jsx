import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import AnimeList from "./pages/AnimeList";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AnimeDetail from "./pages/AnimeDetail";
import GenreList from "./pages/GenreList";

// Scroll to top component - must be inside Router
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

// 404 Not Found Page
function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Go to Home
          </a>
          <a
            href="/all-anime"
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200"
          >
            Browse All Anime
          </a>
        </div>
        <div className="mt-12 text-6xl animate-bounce">🔍</div>
      </div>
    </div>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <div>
              <Home />
            </div>
          }
        />

        {/* All Anime with search */}
        <Route
          path="/all-anime"
          element={
            <div>
              <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <Search onSearch={setSearchTerm} />
              </div>
              <AnimeList searchQuery={searchTerm} />
            </div>
          }
        />

        {/* Anime detail page */}
        <Route path="/anime/:id" element={<AnimeDetail />} />

        {/* Genre list page */}
        <Route path="/genre/:genre" element={<GenreList />} />

        {/* 404 Not Found - catch all routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}