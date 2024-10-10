import React, { useCallback } from "react";
import styles from "./Track.module.css";

function Track({ track, addToPlaylist, showAddButton, removeFromPlaylist }) {
  const buttonLabel = showAddButton ? "+" : "-";
  const onClickHandler = useCallback(() => {
    showAddButton ? addToPlaylist(track) : removeFromPlaylist(track);
  }, [track, addToPlaylist, removeFromPlaylist, showAddButton]);

  return (
    <div className={styles.trackContainer}>
      <div className={styles.trackInfo}>
        <p className={styles.trackName}>{track.name}</p>
        <p className={styles.trackDetails}>
          {track.artist} | {track.album}
        </p>
      </div>

      <button
        onClick={onClickHandler}
        className={styles.trackButton}
        title={showAddButton ? "Add to Playlist" : "Remove from Playlist"}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default React.memo(Track);
