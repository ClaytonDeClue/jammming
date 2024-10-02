import React, { useState, useRef } from "react";
import TrackList from "../TrackList/TrackList";
import { FaEdit } from "react-icons/fa"; // Import an edit icon (you'll need react-icons package)
import styles from "./Playlist.module.css"; // Import the CSS module

function Playlist({
  playlistName,
  playlist,
  setPlaylistName,
  removeFromPlaylist,
  savePlaylist,
}) {
  // Track if the user is editing the playlist name
  const [isEditing, setIsEditing] = useState(false);

  // Create a reference for the editable h2 element
  const titleRef = useRef(null);

  //Handle when the user presses enter or clicks outside of the input
  const handleBlurOrEnter = (event) => {
    if (event.type === "blur" || event.key === "Enter") {
      setIsEditing(false);
      // Update State only after editing is done
      setPlaylistName(event.target.innerText);
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
        titleRef.current.focus();
    }, 0);
  };

  return (
    <div className={styles.playlistContainer}>
      <div
        className={styles.editableTitleContainer}
        title="Click to edit playlist name" //Tooltip on hover
      >
        <h2
          className={`${styles.editableTitle} ${isEditing ? styles.editableActive : ''}`}
          contentEditable={isEditing} // Makes the h2 editable
          suppressContentEditableWarning={true} // Prevent React warnings for contentEditable
          onBlur={handleBlurOrEnter} // Exit editing mode on blur
          onKeyDown={handleBlurOrEnter} // Exit editing mode on Enter key
          onClick={enableEditing} // Enable editing on click
          ref={titleRef} // Reference the h2 element
        >
          {playlistName}
        </h2>
        <FaEdit
          className={styles.editIcon}
          title="Click to edit playlist name"
          onClick={enableEditing}
        />
      </div>

      <div className={styles.trackListContainer}>
        <TrackList
          tracks={playlist}
          showAddButton={false}
          removeFromPlaylist={removeFromPlaylist}
        />
      </div>

      <button className={styles.saveButton} onClick={savePlaylist}>
        Save to Spotify
      </button>
    </div>
  );
}

export default Playlist;
