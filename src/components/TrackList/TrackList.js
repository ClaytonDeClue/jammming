import React from "react";
import Track from "../Track/Track";

function TrackList({ tracks = [], addToPlaylist, showAddButton }) {
  return (
    <div>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          addToPlaylist={addToPlaylist}
          showAddButton={showAddButton}
        />
      ))}
    </div>
  );
}

export default TrackList;
