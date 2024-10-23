import { render, fireEvent, screen } from "@testing-library/react";
import Playlist from "./Playlist";

test("edits playlist name", () => {
  const setPlaylistName = jest.fn();

  // Render the component
  render(
    <Playlist playlistName="My Playlist" setPlaylistName={setPlaylistName} />
  );

  // Use screen to query the elements and simulate editing the contentEditable h2
  const playlistTitle = screen.getByText("My Playlist");

  // Click to activate contentEditable
  fireEvent.click(playlistTitle);

  // Simulate editing the content of the contentEditable element
  fireEvent.input(playlistTitle, { target: { innerText: "Updated Playlist" } });

  // Simulate blur event to trigger saving the updated playlist name
  fireEvent.blur(playlistTitle);

  // Assert that setPlaylistName was called with the updated value
  expect(setPlaylistName).toHaveBeenCalledWith("Updated Playlist");
});

test("toggles between public and private playlists", () => {
  const setPlaylistName = jest.fn();
  const savePlaylist = jest.fn();

  // Render the component
  render(
    <Playlist
      playlistName="My Playlist"
      playlist={[]}
      setPlaylistName={setPlaylistName}
      savePlaylist={savePlaylist}
    />
  );

  // Get the checkbox element (the toggle switch input)
  const toggleSwitch = screen.getByRole("checkbox");

  // Initially the playlist should be private (unchecked)
  expect(toggleSwitch).not.toBeChecked();

  // Simulate user clicking to toggle the switch (make it public)
  fireEvent.click(toggleSwitch);

  // Now it should be checked (public)
  expect(toggleSwitch).toBeChecked();

  // Simulate use clicking again to toggle back (private)
  fireEvent.click(toggleSwitch);

  // Initially the playlist should be unchecked (private)
  expect(toggleSwitch).not.toBeChecked();
});

test("saves the playlist", () => {
  const setPlaylistName = jest.fn();
  const savePlaylist = jest.fn();

  // Render the component with initial private state
  render(
    <Playlist
      playlistName="My Playlist"
      playlist={[]}
      setPlaylistName={setPlaylistName}
      savePlaylist={savePlaylist}
    />
  );

  // Simulate saving the playlist while it's private
  const saveButton = screen.getByText("Save to Spotify");
  fireEvent.click(saveButton);

  // Ensure savePlaylist is called with false (private)
  expect(savePlaylist).toHaveBeenCalledWith(false);

  // Toggle to public and save again
  const toggleSwitch = screen.getByRole("checkbox");
  fireEvent.click(toggleSwitch); // Make it public
  fireEvent.click(saveButton); // Save again

  // Ensure savePlaylist is called with true (public)
  expect(savePlaylist).toHaveBeenCalledWith(true);
});

test("removes a track from the playlist", () => {
  const setPlaylistName = jest.fn();
  const removeFromPlaylist = jest.fn();
  const savePlaylist = jest.fn();

  // Mock playlist
  const mockPlaylist = [
    { id: 1, name: "Track 1" },
    { id: 2, name: "Track 2" },
  ];

  // Render the component
  render(
    <Playlist
      playlistName="My Playlist"
      playlist={mockPlaylist}
      setPlaylistName={setPlaylistName}
      removeFromPlaylist={removeFromPlaylist}
      savePlaylist={savePlaylist}
    />
  );

  // Find the button or element responsible for removing the tracks
  const removeButtons = screen.getAllByTitle("Remove from Playlist");

  // Choose the first track's remove button (for "Track 1")
  const removeTrack1Button = removeButtons[0];

  // Simulate removing the track
  fireEvent.click(removeTrack1Button);

  // Assert that removeFromPlaylist was called with the correct track id
  expect(removeFromPlaylist).toHaveBeenCalledWith(mockPlaylist[0]);
});
