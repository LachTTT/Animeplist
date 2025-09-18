import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import AnimeList from "./pages/AnimeList";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnimeDetail from "./pages/AnimeDetail";
import GenreList from "./pages/GenreList";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <div className="px-5">
              <Home />
            </div>
          }
        />

        {/* All Anime with search */}
        <Route
          path="/all-anime"
          element={
            <div className="px-5">
              <Search onSearch={setSearchTerm} />
              <AnimeList searchQuery={searchTerm} />
            </div>
          }
        />

        {/* Anime detail page */}
        <Route path="/anime/:id" element={<AnimeDetail />} />

        {/* ✅ Genre list page – param name is “genre” everywhere */}
        <Route path="/genre/:genre" element={<GenreList />} />
      </Routes>
    </Router>
  );
}
