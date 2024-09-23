import React from "react";
import TrackList from "../TrackList/TrackList";

function SearchResults({ searchResults, addToPlaylist }) {
  return (
    <div>
      <h2>Search Results</h2>
      <TrackList
        tracks={searchResults}
        addToPlaylist={addToPlaylist}
        showAddButton={true}
      />
    </div>
  );
}

export default SearchResults;
