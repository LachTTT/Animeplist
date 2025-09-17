import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import AnimeList from "./pages/AnimeList";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home page route */}
        <Route
          path="/"
          element={
            <div className="px-5">
              <Home />
            </div>
          }
        />

        {/* ✅ Single route that shows Search + AnimeList together */}
        <Route
          path="/all-anime"
          element={
            <div className="px-5">
              <Search onSearch={setSearchTerm} />
              <AnimeList searchQuery={searchTerm} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
