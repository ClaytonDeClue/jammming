import styles from "./App.module.css";
import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

function App() {
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: "Song 1",
      artist: "Artist 1",
      album: "Album 1",
      uri: 'spotify:track:1',
    },
    {
      id: 2,
      name: "Song 2",
      artist: "Artist 2",
      album: "Album 2",
      uri: 'spotify:track:2',
    },
    {
      id: 3,
      name: "Song 3",
      artist: "Artist 3",
      album: "Album 3",
      uri: 'spotify:track:3',
    },
  ]);

  const [playlistName, setPlaylistName] = useState("Playlist Name");

  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = (track) => {
    if (playlist.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    setPlaylist([...playlist, track]);
  };

  const removeFromPlaylist = (track) => {
    const newPlaylist = playlist.filter(savedTrack => savedTrack.id !== track.id);

    setPlaylist(newPlaylist);
  }

  const savePlaylist = () => {
    // extract URIs from the playlist
    const trackUris = playlist.map(track => track.uri);
    console.log('Saving playlist to Spotify with URIs:', trackUris);

    // Reset the playlist after saving
    setPlaylist([]);
    setPlaylistName('New Playlist');
  }

  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar />
      <SearchResults
        searchResults={searchResults}
        addToPlaylist={addToPlaylist}
      />
      <Playlist
        playlistName={playlistName}
        playlist={playlist}
        setPlaylistName={setPlaylistName}
        removeFromPlaylist={removeFromPlaylist}
        savePlaylist={savePlaylist}
      />
    </div>
  );
}

export default App;
