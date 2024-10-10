import '../../styles/variables.module.css'
import styles from "./App.module.css";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../utils/Spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    // Fetch the access token when the component mounts
    Spotify.getAccessToken();
  }, []);

  const addToPlaylist = useCallback((track) => {
    const trackSet = new Set(playlist.map((track) => track.id));
    if (!trackSet.has(track.id)) {
      setPlaylist([...playlist, track]);
    }
  }, [playlist]);

  const removeFromPlaylist = useCallback((track) => {
    const newPlaylist = playlist.filter(
      (savedTrack) => savedTrack.id !== track.id
    );

    setPlaylist(newPlaylist);
  }, [playlist]);

  const savePlaylist = useCallback((isPublic) => {
    // extract URIs from the playlist
    const trackUris = playlist.map((track) => track.uri);
    console.log("Saving playlist to Spotify with URIs:", trackUris);

    Spotify.savePlaylist(playlistName, trackUris, isPublic);

    // Reset the playlist after saving
    setPlaylist([]);
    setPlaylistName("New Playlist");
  }, [playlist, playlistName]);

  const searchSpotify = async (searchTerm) => {
    try {
      const tracks = await Spotify.searchTracks(searchTerm);
      setSearchResults(tracks); // Update search results state
    } catch (error) {
      console.error("Error fetching tracks: ", error);
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.banner}>
        <h1>
          Ja<span className={styles.coloredM}>mmm</span>ing
        </h1>
      </div>
      <div className={styles.container}>
        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={searchSpotify} />
        </div>

        <div className={styles.playlistResultContainer}>
          <div className={styles.searchResults}>
            <SearchResults
              searchResults={searchResults}
              addToPlaylist={addToPlaylist}
            />
          </div>

          <div className={styles.playlist}>
            <Playlist
              playlistName={playlistName}
              playlist={playlist}
              setPlaylistName={setPlaylistName}
              removeFromPlaylist={removeFromPlaylist}
              savePlaylist={savePlaylist}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
