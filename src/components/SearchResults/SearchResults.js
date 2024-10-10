import React from "react";
import TrackList from "../TrackList/TrackList";
import styles from './SearchResults.module.css'

function SearchResults({ searchResults, addToPlaylist }) {
  return (
    <div className={styles.searchResultContainer}>
      <h2>Search Results</h2>
      <TrackList
        tracks={searchResults}
        addToPlaylist={addToPlaylist}
        showAddButton={true}
      />
    </div>
  );
}

export default React.memo(SearchResults);
