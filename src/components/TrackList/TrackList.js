import React from "react";
import Track from "../Track/Track";

function TrackList({
  tracks = [],
  addToPlaylist,
  showAddButton,
  removeFromPlaylist,
}) {
  return (
    <div>
      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          addToPlaylist={addToPlaylist}
          showAddButton={showAddButton}
          removeFromPlaylist={removeFromPlaylist}
        />
      ))}
    </div>
  );
}

export default React.memo(TrackList);
