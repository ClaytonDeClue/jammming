import React, { useState } from "react";
import TrackList from "../TrackList/TrackList";
import { FaEdit } from "react-icons/fa"; // Import an edit icon (you'll need react-icons package)
import styles from "./Playlist.module.css"; // Import the CSS module

function Playlist({ playlistName, playlist, setPlaylistName, removeFromPlaylist, savePlaylist }) {
  // Track if the user is editing the playlist name
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  //Handle when the user presses enter or clicks outside of the input
  const handleBlurOrEnter = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {/* Display the playlist name as <h2> when not editing */}
      {isEditing ? (
        <input
          type="text"
          value={playlistName}
          onChange={handleNameChange}
          onBlur={handleBlurOrEnter}
          onKeyDown={(e) => e.key === "Enter" && handleBlurOrEnter()} // When the user presses Enter
          autoFocus
        />
      ) : (
        <div
          className={styles.editableTitleContainer}
          onClick={() => setIsEditing(true)}
          title="Click to edit playlist name" //Tooltip on hover
        >
          <h2 className={styles.editableTitle}>{playlistName}</h2> {/* Click to edit Playlist name */}
          <FaEdit className={styles.editIcon} /> {/* Edit Icon */}
        </div>
      )}

      <TrackList tracks={playlist} showAddButton={false} removeFromPlaylist={removeFromPlaylist} />
      <button onClick={savePlaylist}>Save to Spotify</button>
    </div>
  );
}

export default Playlist;
