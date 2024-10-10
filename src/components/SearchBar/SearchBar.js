import React, { useState, useCallback } from "react";
import styles from "./SearchBar.module.css";
import sharedStyles from "../../styles/shared.module.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = useCallback(
    (event) => {
      if (
        (event.key === "Enter" || event.type === "click") &&
        searchTerm.trim()
      ) {
        onSearch(searchTerm);
      }
    },
    [searchTerm, onSearch]
  );

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search for a song, album, or artist"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        aria-label="Search for a song, album, or artist"
        title="Song, album, or artist to search for"
      />
      <button
        className={sharedStyles.roundedButton}
        onClick={handleKeyPress}
        aria-label="Search button"
        title="Search Spotify"
      >
        Search
      </button>
    </div>
  );
};

export default React.memo(SearchBar);
