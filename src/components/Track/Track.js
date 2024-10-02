import React from "react";
import styles from "./Track.module.css";

function Track({ track, addToPlaylist, showAddButton, removeFromPlaylist }) {
  return (
    <div className={styles.trackContainer}>
        <div className={styles.trackInfo}>
        <p className={styles.trackName}>
        {track.name} 
      </p>
      <p className={styles.trackDetails}>{track.artist} | {track.album}</p>
        </div>
      
      {showAddButton ? (
        <button
          onClick={() => addToPlaylist(track)}
          className={styles.trackButton}
          title="Add to Playlist"
        >
          +
        </button>
      ) : (
        <button
          onClick={() => removeFromPlaylist(track)}
          className={styles.trackButton}
          title="Remove from Playlist"
        >
          -
        </button>
      )}
    </div>
  );
}

export default Track;
