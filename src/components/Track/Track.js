import React from "react";

function Track({ track }) {
    return (
        <div>
            <p>{track.name} - {track.artist} | {track.album}</p>
        </div>
    );
}

export default Track;