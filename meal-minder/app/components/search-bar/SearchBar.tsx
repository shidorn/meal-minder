import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex items-center p-2 w-6">
      <div className="flex flex-row">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
