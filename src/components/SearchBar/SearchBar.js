import React, { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      searchTerm.trim() && onSearch(searchTerm);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Enter a song name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className={styles.searchButton} onClick={handleKeyPress}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
