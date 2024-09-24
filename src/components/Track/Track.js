import React from "react";
import styles from "./Track.module.css";

function Track({ track, addToPlaylist, showAddButton, removeFromPlaylist }) {
  return (
    <div className={styles.trackContainer}>
      <p>
        {track.name} - {track.artist} | {track.album}
      </p>
      {showAddButton ? (
        <button
          onClick={() => addToPlaylist(track)}
          className={styles.trackButton}
        >
          +
        </button>
      ) : (
        <button
          onClick={() => removeFromPlaylist(track)}
          className={styles.trackButton}
        >
          -
        </button>
      )}
    </div>
  );
}

export default Track;
