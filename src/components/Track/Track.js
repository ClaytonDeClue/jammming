import React from "react";
import styles from "./Track.module.css";

function Track({ track, addToPlaylist, showAddButton }) {
  return (
    <div className={styles.trackContainer}>
      <p>
        {track.name} - {track.artist} | {track.album}
      </p>
      {showAddButton && (
        <button
          onClick={() => addToPlaylist(track)}
          className={styles.addButton}
        >
          +
        </button>
      )}
    </div>
  );
}

export default Track;
