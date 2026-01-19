// src/components/AnimeSearchBar.jsx
import { useState, useEffect } from "react";

export default function Search({ onSearch }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Debounce: call onSearch only when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(text);
    }, 500);
    return () => clearTimeout(timer);
  }, [text, onSearch]);

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="relative group">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? "text-blue-600" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {/* Input field */}
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for anime titles, genres, or characters..."
          className={`
            w-full pl-14 pr-14 py-4 
            text-base text-gray-900 placeholder-gray-400
            bg-white
            border-2 rounded-2xl
            shadow-lg
            transition-all duration-300
            focus:outline-none
            ${
              isFocused
                ? "border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
        />

        {/* Clear button */}
        {text && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Animated underline effect */}
        <div
          className={`
            absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full
            transition-all duration-300
            ${isFocused ? "w-full opacity-100" : "w-0 opacity-0"}
          `}
        />
      </div>
    </div>
  );
}
