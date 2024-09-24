const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = "http://localhost:3000/";
let accessToken;
let expiresIn;

const Spotify = {
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
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

      // By setting window.location, the browser navigates to the specified URL, which initiates the Spotify login and authorization process.
      // After the user authorizes the app, they will be redirected back to the app with the access token in the URL.
      window.location = accessUrl;
    }
  },
};

export default Spotify;
