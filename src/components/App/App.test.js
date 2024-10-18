import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import App from "./App";
import Spotify from "../../utils/Spotify";

// Mocking Spotify API functions
jest.mock("../../utils/Spotify", () => ({
  getAccessToken: jest.fn(),
  searchTracks: jest.fn(),
  savePlaylist: jest.fn(),
}));

const mockTracks = [
  {
    id: "1",
    name: "Track 1",
    artist: "Artist 1",
    album: "Album 1",
    uri: "spotify:track:1",
  },
  {
    id: "2",
    name: "Track 2",
    artist: "Artist 2",
    album: "Album 2",
    uri: "spotify:track:2",
  },
];

describe("App Integration Tests", () => {
  beforeEach(() => {
    Spotify.searchTracks.mockResolvedValue(mockTracks); // Mocking the search results
  });

  test("renders App and performs search", async () => {
    // Render the App component
    render(<App />);

    // Verify that the initial playlist name is displayed
    expect(screen.getByText("New Playlist")).toBeInTheDocument();

    // Simulate typing a search term
    const searchInput = screen.getByPlaceholderText(
      "Search for a song, album, or artist"
    );
    fireEvent.change(searchInput, { target: { value: "test search" } });

    // Simulate clicking the search button
    const searchButton = screen.getByTitle("Search Spotify");
    fireEvent.click(searchButton);

    // Verify that the search results are rendered
    await waitFor(() => {
      expect(screen.getByText("Track 1")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Track 2")).toBeInTheDocument();
    });
  });

  test("adds and removes tracks from the playlist", async () => {
    // Render the App component
    render(<App />);

    // Simulate typing a search term and performing a search
    const searchInput = screen.getByPlaceholderText(
      "Search for a song, album, or artist"
    );
    fireEvent.change(searchInput, { target: { value: "test search" } });
    const searchButton = screen.getByTitle("Search Spotify");
    fireEvent.click(searchButton);

    // Wait for the search results to appear
    await waitFor(() => {
      expect(screen.getByText("Track 1")).toBeInTheDocument();
    });

    // Find the Search Results container and the Playlist container
    const searchResultsContainer = screen.getByRole("region", {
      name: "Search Results",
    });
    const playlistContainer = screen.getByRole("region", {
      name: "New Playlist",
    });

    // Add a track to the playlist
    const addTrackButton = within(searchResultsContainer).getAllByTitle(
      "Add to Playlist"
    )[0];
    fireEvent.click(addTrackButton);

    // Verify that the track was added to the playlist
    expect(within(playlistContainer).getByText("Track 1")).toBeInTheDocument();
    expect(
      within(playlistContainer).getByTitle("Remove from Playlist")
    ).toBeInTheDocument();

    // Verify that the track was removed from the search results
    expect(within(searchResultsContainer).queryByText("Track 1")).not.toBeInTheDocument();

    // Remove the track from the playlist
    const removeTrackButton = within(playlistContainer).getByTitle(
      "Remove from Playlist"
    );
    fireEvent.click(removeTrackButton);

    // Verify that the track was removed from the playlist
    expect(
      within(playlistContainer).queryByText("Track 1")
    ).not.toBeInTheDocument();

    // Verify that the track was added back to the search results
    expect(within(searchResultsContainer).getByText("Track 1")).toBeInTheDocument();
  });

  test("toggles between public and private playlists", () => {
    // Render the App component
    render(<App />);

    // Find the toggle switch
    const toggleSwitch = screen.getByRole("checkbox");

    // Initially it should be unchecked (private playlist)
    expect(toggleSwitch).not.toBeChecked();

    // Simulate toggling the switch to public
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();

    // Simulate toggling the switch back to private
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).not.toBeChecked(); // Now private
  });

  test("saves the playlist to Spotify", async () => {
    // Render the App component
    render(<App />);

    // Simulate typing a search term and performing a search
    const searchInput = screen.getByPlaceholderText(
      "Search for a song, album, or artist"
    );
    fireEvent.change(searchInput, { target: { value: "test search" } });
    const searchButton = screen.getByTitle("Search Spotify");
    fireEvent.click(searchButton);

    // Wait for the search results to appear
    await waitFor(() => {
      expect(screen.getByText("Track 1")).toBeInTheDocument();
    });

    // Find the Search Results container and the Playlist container
    const searchResultsContainer = screen.getByRole("region", {
      name: "Search Results",
    });
    const playlistContainer = screen.getByRole("region", {
      name: "New Playlist",
    });

    // Add a track to the playlist
    const addTrackButton = within(searchResultsContainer).getAllByTitle(
      "Add to Playlist"
    )[0];
    fireEvent.click(addTrackButton);

    // Simulate saving the playlist
    const saveButton = within(playlistContainer).getByText("Save to Spotify");
    fireEvent.click(saveButton);

    // Verify that the Spotify.savePlaylist function was called with the correct arguments
    expect(Spotify.savePlaylist).toHaveBeenCalledWith(
      "New Playlist",
      ["spotify:track:1"],
      false // Playlist is private by default
    );

    // Verify that the playlist is reset after saving
    expect(screen.getByText("New Playlist")).toBeInTheDocument();
    expect(
      within(playlistContainer).queryByText("Track 1")
    ).not.toBeInTheDocument();
  });
});
