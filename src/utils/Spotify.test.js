import Spotify from "./Spotify";

// Mocking the global fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

beforeEach(() => {
  jest.clearAllMocks();

  // Reset the fetch mock before each test
  fetch.mockClear();
  window.setTimeout = jest.fn(); // Mock window.setTimeout if necessary

  // Mock window.location with necessary properties
  delete window.location;
  window.location = {
    href: "http://localhost:3000/",
    assign: jest.fn(), // Mock function to prevent actual navigation
  };

  // Reset Spotify's internal state
  Spotify.setAccessToken(""); // Ensure accessToken is reset between tests
  Spotify.setExpiresIn(0); // Ensure expiresIn is reset between tests

  // Mocking window.history.pushState
  if (!window.history) {
    window.history = {};
  }
  window.history.pushState = jest.fn(); // Mock pushState to track its calls
});

describe("Spotify Utility", () => {
  describe("getAccessToken", () => {
    it("should return the existing access token if already set", () => {
      Spotify.setAccessToken("12345"); // Set the access token using Spotify's method
      const token = Spotify.getAccessToken();
      expect(token).toBe("12345");
    });

    it("should extract the access token from URL if not already set", () => {
      const mockAccessToken = "newAccessToken";
      const mockExpiresIn = "3600";

      // Mocking window.location.href with access_token and expires_in
      window.location.href = `http://localhost:3000/?access_token=${mockAccessToken}&expires_in=${mockExpiresIn}`;

      // Call the real implementation of getAccessToken to test token extraction from URL
      const token = Spotify.getAccessToken();

      // Ensure the token is correctly extracted from the URL
      expect(token).toBe(mockAccessToken);

      // Also check that the internal state is correctly set
      expect(Spotify.getAccessTokenValue()).toBe(mockAccessToken);
      expect(Spotify.getExpiresIn()).toBe(Number(mockExpiresIn));

      // Check if clearToken method behaves as expected
      expect(window.setTimeout).toHaveBeenCalled();
      expect(window.history.pushState).toHaveBeenCalledWith(
        "Access Token",
        null,
        "/"
      );
    });

    it("should redirect to Spotify authorization page if no token in URL", () => {
      // Ensuring href does not contain tokens
      //window.location.href = 'http://localhost:3000/';
      Spotify.getAccessToken();

      expect(window.location.assign).toHaveBeenCalledWith(
        expect.stringContaining("https://accounts.spotify.com/authorize")
      );
    });
  });

  describe("searchTracks", () => {
    it("should search for tracks and return formatted results", async () => {
      Spotify.setAccessToken("12345");
      const mockTracksResponse = {
        tracks: {
          items: [
            {
              id: "1",
              name: "Track 1",
              artists: [{ name: "Artist 1" }],
              album: { name: "Album 1" },
              uri: "spotify:track:1",
            },
          ],
        },
      };

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockTracksResponse),
      });

      const tracks = await Spotify.searchTracks("test song");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.spotify.com/v1/search?type=track&q=test%20song"
        ),
        expect.objectContaining({
          headers: {
            Authorization: expect.any(String),
          },
        })
      );

      expect(tracks).toEqual([
        {
          id: "1",
          name: "Track 1",
          artist: "Artist 1",
          album: "Album 1",
          uri: "spotify:track:1",
        },
      ]);
    });

    it("should return an empty array if no tracks found", async () => {
      Spotify.setAccessToken("12345");

      const mockEmptyResponse = { tracks: { items: [] } };

      fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockEmptyResponse),
      });

      const tracks = await Spotify.searchTracks("empty response");
      expect(tracks).toEqual([]);
    });
  });

  describe("savePlaylist", () => {
    it("should get user ID, create a new playlist, and add tracks to it", async () => {
      const mockUserId = "user123";
      const mockPlaylistId = "playlist456";
      const mockAccessToken = "accessToken789";

      Spotify.setAccessToken(mockAccessToken);

      // Mocking getCurrentUserId response
      fetch
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce({ id: mockUserId }),
        })
        // Mocking createNewPlaylist response
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce({ id: mockPlaylistId }),
        })
        // Mocking addTracksToPlaylist response
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce({ snapshot_id: "snapshot123" }),
        });

      // Call savePlaylist with playlist name and URIs
      const trackUris = ["spotify:track:1", "spotify:track:2"];
      await Spotify.savePlaylist("My Playlist", trackUris, false);

      // Check if the correct requests were made
      expect(fetch).toHaveBeenCalledTimes(3);

      // Check if getUserId was called
      expect(fetch).toHaveBeenCalledWith(
        "https://api.spotify.com/v1/me",
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockAccessToken}` },
        })
      );

      // Check if createNewPlaylist was called
      expect(fetch).toHaveBeenCalledWith(
        `https://api.spotify.com/v1/users/${mockUserId}/playlists`,
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "My Playlist",
            description: "Custom playlist from Jammming",
            public: false,
          }),
        })
      );

    //   // Check if addTracksToPlaylist was called
      expect(fetch).toHaveBeenCalledWith(
        `https://api.spotify.com/v1/playlists/${mockPlaylistId}/tracks`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: trackUris }),
        })
      );
    });
  });
});
