const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:3000/";
let accessToken;
let expiresIn;

const Spotify = {
  // Function to get the accessToken for current user
  getAccessToken() {
    if (accessToken) {
      return accessToken; // Return the existing token if it's already set
    }

    // Check if access token is in the URL by using regex to extract access_token and expires_in from the current page's URL.
    // ([^&]*) captures everything between access_token= and the next & (if present), representing the token
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    // Check if access_token and expires_in were both found in the URL
    if (tokenMatch && expiresInMatch) {
      // Extract the access token and expiration time from the URL
      accessToken = tokenMatch[1];
      expiresIn = Number(expiresInMatch[1]); // convert expires_in to number, value is given in seconds

      // Clear the access token after amount of time stored in expiresIn has passed.
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000); // setTimeout schedules a function to run after a certain amount of time.
      // Clear the access token and expiration time from the URL without reloading the page.
      window.history.pushState("Access Token", null, "/"); // Replaces the current URL with just '/', removing any sensitive information from the URL after it has been extracted.

      return accessToken;
    }
    // If no token and expiration time found in URL, redirect the user to Spotify's authorization page
    else {
      // client_id: The Spotify client ID of the app.
      // response_type=token: This tells Spotify to use the Implicit Grant Flow, which returns the access token directly in the URL.
      // scope=playlist-modify-public: This defines the permissions the app is requesting (in this case, the ability to modify public playlists).
      // redirect_uri: The URI Spotify will redirect the user to after authorization, which includes the token.
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public playlist-modify-private&redirect_uri=${redirectUri}`;

      // By setting window.location, the browser navigates to the specified URL, which initiates the Spotify login and authorization process.
      // After the user authorizes the app, they will be redirected back to the app with the access token in the URL.
      window.location = accessUrl;
    }
  },

  // Function to search for Tracks using Spotify API
  async searchTracks(searchTerm) {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      console.error("No access token available!");
      return [];
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.tracks) {
        // Format the tracks and return them in the required structure
        const tracks = data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));

        return tracks; // Return the formatted tracks
      } else {
        console.log("No tracks found!");
        return [];
      }
    } catch (error) {
      console.log("Error fetching tracks from Spotify API: ", error);
      return [];
    }
  },

  // Save Playlist Helper Function to get the current user's ID
  async getCurrentUserId() {
    const accessToken = this.getAccessToken();
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return data.id; // Returns the user's spotify ID
  },

  // Save Playlist Helper Function to create a new playlist
  async createNewPlaylist(userId, playlistName, isPublic) {
    const accessToken = this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: "Custom playlist from Jammming",
          public: isPublic,
        }),
      }
    );

    const data = await response.json();
    return data.id; // Returns the ID of the newly created playlist
  },

  // Save Playlist Helper Function to add tracks to the playlist
  async addTracksToPlaylist(playlistId, trackUris) {
    const accessToken = this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );

    const data = await response.json();
    return data;
  },

  // Orchestration function to handle saving the playlist
  async savePlaylist(playlistName, trackUris, isPublic) {
    try {
      // Step 1: Get the user ID
      const userId = await this.getCurrentUserId();

      // Step 2: Create a new playlist
      const playlistId = await this.createNewPlaylist(userId, playlistName, isPublic);

      // Step 3: Add tracks to the new playlist
      await this.addTracksToPlaylist(playlistId, trackUris);

      console.log("Playlist saved successfully!");
    } catch (error) {
      console.error("Error saving the playlist: ", error);
    }
  },
};

export default Spotify;
