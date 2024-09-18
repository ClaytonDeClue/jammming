import React from 'react';
import TrackList from '../TrackList/TrackList';

function SearchResults({ searchResults }) {
    return (
        <div>
            <h2>Search Results</h2>
            <TrackList tracks={searchResults} />
        </div>
    );
}

export default SearchResults;