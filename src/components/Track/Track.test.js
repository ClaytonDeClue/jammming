import { render, fireEvent, screen } from "@testing-library/react";
import Track from "./Track";

test("should add track to playlist when Add button is clicked", () => {
  const mockAddToPlaylist = jest.fn();
  const track = { id: 1, name: "Song Name", artist: "Artist", album: "Album" };

  render(
    <Track
      track={track}
      addToPlaylist={mockAddToPlaylist}
      showAddButton={true}
    />
  );

  fireEvent.click(screen.getByTitle("Add to Playlist"));

  expect(mockAddToPlaylist).toHaveBeenCalledWith(track);
});

test("should remove track from playlist when Remove button is clicked", () => {
  const mockRemoveFromPlaylist = jest.fn();
  const track = { id: 1, name: "Song Name", artist: "Artist", album: "Album" };

  render(
    <Track
      track={track}
      removeFromPlaylist={mockRemoveFromPlaylist}
      showAddButton={false}
    />
  );

  fireEvent.click(screen.getByTitle("Remove from Playlist"));

  expect(mockRemoveFromPlaylist).toHaveBeenCalledWith(track);
});
